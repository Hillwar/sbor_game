// Мини-игры
import { EventEmitter } from './utils.js';

export class MinigameManager extends EventEmitter {
  constructor(game) {
    super();
    this.game = game;
  }
  
  startStrengthMinigame() {
    const minigameContainer = document.createElement('div');
    minigameContainer.classList.add('minigame-container');
    minigameContainer.innerHTML = `
      <div class="minigame-title">Поднимай коробки!</div>
      <div class="minigame-progress">
        <div class="progress-bar"></div>
      </div>
      <div class="minigame-instructions">Нажимай ПРОБЕЛ быстро!</div>
      <div class="minigame-timer">15</div>
    `;
    
    document.body.appendChild(minigameContainer);
    
    // Логика мини-игры
    let progress = 0;
    let timeLeft = 15;
    const progressBar = minigameContainer.querySelector('.progress-bar');
    const timerElement = minigameContainer.querySelector('.minigame-timer');
    
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        progress += 2;
        if (progress > 100) progress = 100;
        progressBar.style.width = `${progress}%`;
        
        if (progress === 100) {
          endMinigame(true);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    const timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;
      
      if (timeLeft <= 0) {
        endMinigame(false);
      }
    }, 1000);
    
    const endMinigame = (success) => {
      clearInterval(timer);
      document.removeEventListener('keydown', handleKeyPress);
      
      // Определяем результат
      let strengthGain = 0;
      if (success) {
        strengthGain = 3;
        minigameContainer.innerHTML = `
          <div class="minigame-result success">Отлично! +${strengthGain} к силе</div>
        `;
      } else {
        strengthGain = Math.floor(progress / 33); // 0-1 за неполное прохождение
        minigameContainer.innerHTML = `
          <div class="minigame-result">Неплохо! +${strengthGain} к силе</div>
        `;
      }
      
      // Применяем результат
      const oldStrength = this.game.stats.strength;
      this.game.stats.strength += strengthGain;
      this.game.ui.updateStats(this.game.stats);
      
      // Анимируем изменение
      if (strengthGain > 0) {
        this.game.ui.animateStatChange('strength', oldStrength, this.game.stats.strength);
      }
      
      // Если достигли высокого значения силы, разблокируем достижение
      if (this.game.stats.strength >= 15) {
        this.game.unlockAchievement('strong');
      }
      
      // Закрываем мини-игру через 2 секунды
      setTimeout(() => {
        minigameContainer.remove();
        this.emit('minigameCompleted', 'next_scene');
      }, 2000);
    };
  }
  
  startCharismaMinigame() {
    const minigameContainer = document.createElement('div');
    minigameContainer.classList.add('minigame-container');
    minigameContainer.innerHTML = `
      <div class="minigame-title">Расскажи историю!</div>
      <div class="minigame-text">Выбери слова, чтобы продолжить историю:</div>
      <div class="story-text">Однажды в лагере я...</div>
      <div class="word-choices"></div>
    `;
    
    document.body.appendChild(minigameContainer);
    
    // Варианты слов для истории
    const storyStages = [
      {
        prompt: "Однажды в лагере я...",
        choices: [
          { text: "нашел тайную карту", value: 3 },
          { text: "заблудился в лесу", value: 2 },
          { text: "встретил странного человека", value: 1 }
        ]
      },
      {
        prompt: "И тогда я решил...",
        choices: [
          { text: "собрать команду для приключения", value: 3 },
          { text: "рассказать вожатому", value: 1 },
          { text: "исследовать это самостоятельно", value: 2 }
        ]
      },
      {
        prompt: "В итоге мы обнаружили...",
        choices: [
          { text: "старый заброшенный домик", value: 2 },
          { text: "тайник с сокровищами", value: 3 },
          { text: "что это была просто шутка", value: 1 }
        ]
      }
    ];
    
    let currentStage = 0;
    let totalScore = 0;
    const storyTextElement = minigameContainer.querySelector('.story-text');
    const wordChoicesElement = minigameContainer.querySelector('.word-choices');
    
    // Функция для отображения текущего этапа истории
    const showStoryStage = () => {
      if (currentStage >= storyStages.length) {
        // История завершена, показываем результат
        finishStory();
        return;
      }
      
      const stage = storyStages[currentStage];
      storyTextElement.textContent = stage.prompt;
      wordChoicesElement.innerHTML = '';
      
      stage.choices.forEach(choice => {
        const button = document.createElement('button');
        button.classList.add('word-choice-button');
        button.textContent = choice.text;
        button.addEventListener('click', () => {
          totalScore += choice.value;
          currentStage++;
          storyTextElement.textContent += " " + choice.text;
          
          // Небольшая пауза перед следующим этапом
          setTimeout(() => {
            showStoryStage();
          }, 1000);
        });
        wordChoicesElement.appendChild(button);
      });
    };
    
    // Функция для завершения истории и подсчета результатов
    const finishStory = () => {
      wordChoicesElement.innerHTML = '';
      
      // Определяем результат
      let charismaGain = 0;
      if (totalScore >= 8) {
        charismaGain = 3;
        storyTextElement.innerHTML = `Твоя история была потрясающей! Все слушали с открытыми ртами.<br><span class="gain-text">+${charismaGain} к харизме!</span>`;
      } else if (totalScore >= 6) {
        charismaGain = 2;
        storyTextElement.innerHTML = `Хорошая история! Многим понравилось.<br><span class="gain-text">+${charismaGain} к харизме!</span>`;
      } else {
        charismaGain = 1;
        storyTextElement.innerHTML = `История была неплохой, но можно лучше.<br><span class="gain-text">+${charismaGain} к харизме!</span>`;
      }
      
      // Применяем результат
      const oldCharisma = this.game.stats.charisma;
      this.game.stats.charisma += charismaGain;
      this.game.ui.updateStats(this.game.stats);
      
      // Анимируем изменение
      if (charismaGain > 0) {
        this.game.ui.animateStatChange('charisma', oldCharisma, this.game.stats.charisma);
      }
      
      // Проверяем достижение
      if (this.game.stats.charisma >= 15) {
        this.game.unlockAchievement('charismatic');
      }
      
      // Добавляем кнопку продолжения
      const continueButton = document.createElement('button');
      continueButton.classList.add('minigame-continue-button');
      continueButton.textContent = 'Продолжить';
      continueButton.addEventListener('click', () => {
        minigameContainer.remove();
        this.emit('minigameCompleted', 'next_scene');
      });
      
      minigameContainer.appendChild(continueButton);
    };
    
    // Запускаем первый этап
    showStoryStage();
  }
} 