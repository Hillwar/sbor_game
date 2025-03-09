// Основной класс игры
import { CONFIG } from './config.js';
import { UIManager } from './ui.js';
import { MinigameManager } from './minigames.js';
import { preloadImage, animateText } from './utils.js';
import { getRandomEvent } from './scenario.js';
import { TextManager } from './textManager.js';

export class VisualNovel {
  constructor(scenario) {
    this.scenario = scenario;
    this.currentScene = null;
    this.currentSceneId = null;
    this.isTextAnimating = false;
    this.stats = { ...CONFIG.initialStats };
    this.achievements = { ...CONFIG.achievements };
    this.relationships = { ...CONFIG.relationships };
    
    this.ui = new UIManager();
    this.minigames = new MinigameManager(this);
    
    this.setupEventListeners();
    this.initAudio();
    this.preloadAssets();
    
    // Создаем контейнер для достижений
    this.achievementsContainer = document.createElement('div');
    this.achievementsContainer.classList.add('achievements-container');
    document.body.appendChild(this.achievementsContainer);
    
    // Создаем менеджер текста
    this.textManager = new TextManager(this.ui.elements.dialogText);
    
    // Добавляем обработку ошибок
    window.addEventListener('error', (event) => {
      console.error('Глобальная ошибка:', event.error);
    });
    
    // Добавляем историю сцен и характеристик для возможности возврата
    this.sceneHistory = [];
    this.statsHistory = [];
    this.maxHistoryLength = 10; // Максимальное количество сцен в истории
  }
  
  setupEventListeners() {
    this.ui.on('gameStart', () => this.startGame());
    this.ui.on('gameRestart', () => this.restartGame());
    this.ui.on('continueClicked', () => {
      if (this.isTextAnimating) {
        this.completeTextAnimation();
      } else if (this.currentScene.nextScene) {
        this.loadScene(this.currentScene.nextScene);
      }
    });
    
    // Добавляем обработчик для кнопки "Назад"
    this.ui.on('backClicked', () => {
      this.goBack();
    });
    
    this.minigames.on('minigameCompleted', (nextScene) => {
      this.loadScene(nextScene);
    });
  }
  
  initAudio() {
    this.backgroundMusic = new Audio('assets/audio/background.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
    
    const audioButton = document.createElement('button');
    audioButton.classList.add('audio-control');
    audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    
    const statsPanel = document.querySelector('.stats-panel');
    if (statsPanel) {
      statsPanel.appendChild(audioButton);
      
      let isMuted = false;
      audioButton.addEventListener('click', () => {
        isMuted = !isMuted;
        this.backgroundMusic.muted = isMuted;
        audioButton.innerHTML = isMuted ? 
          '<i class="fas fa-volume-mute"></i>' : 
          '<i class="fas fa-volume-up"></i>';
      });
    }
  }
  
  async preloadAssets() {
    const imagesToPreload = [];
    
    // Собираем все пути к изображениям из сценария
    for (const sceneId in this.scenario) {
      const scene = this.scenario[sceneId];
      if (scene.background) {
        imagesToPreload.push(scene.background);
      }
      if (scene.character) {
        imagesToPreload.push(scene.character);
      }
    }
    
    // Удаляем дубликаты
    const uniqueImages = [...new Set(imagesToPreload)];
    
    // Предзагружаем изображения
    try {
      await Promise.all(uniqueImages.map(url => preloadImage(url)));
      console.log('Все изображения загружены');
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
    }
  }
  
  startGame() {
    console.log('Запуск игры...');
    this.ui.elements.startScreen.style.display = 'none';
    
    // Сбрасываем значения концовки при новом запуске игры
    this.endingTitle = "";
    this.endingMessage = "";
    
    try {
      this.loadScene('start');
      console.log('Сцена "start" загружена');
      
      // Запускаем фоновую музыку
      this.backgroundMusic.play().catch(e => {
        console.log('Автовоспроизведение музыки заблокировано браузером:', e);
      });
    } catch (error) {
      console.error('Ошибка при запуске игры:', error);
    }
  }
  
  restartGame() {
    this.stats = { ...CONFIG.initialStats };
    this.ui.updateStats(this.stats);
    this.ui.elements.endScreen.style.display = 'none';
    
    // Сбрасываем значения концовки при перезапуске игры
    this.endingTitle = "";
    this.endingMessage = "";
    
    // Сбрасываем историю сцен и характеристик
    this.sceneHistory = [];
    this.statsHistory = [];
    
    // Скрываем кнопку "Назад"
    this.ui.showBackButton(false);
    
    this.loadScene('start');
  }
  
  loadScene(sceneId, addToHistory = true, isBackNavigation = false) {
    console.log(`Загрузка сцены: ${sceneId}, addToHistory: ${addToHistory}, isBackNavigation: ${isBackNavigation}`);
    
    // Если нужно добавить текущую сцену в историю
    if (addToHistory && this.currentSceneId) {
      console.log("Сохраняем текущую сцену в историю:", this.currentSceneId);
      
      // Добавляем текущую сцену в историю перед загрузкой новой
      this.sceneHistory.push(this.currentSceneId);
      
      // Сохраняем текущие характеристики
      console.log("Сохраняем текущие характеристики:", {...this.stats});
      this.statsHistory.push({...this.stats});
      
      // Ограничиваем размер истории
      if (this.sceneHistory.length > this.maxHistoryLength) {
        this.sceneHistory.shift(); // Удаляем самую старую сцену
        this.statsHistory.shift(); // Удаляем самые старые характеристики
      }
      
      // Показываем кнопку "Назад", если есть история
      this.ui.showBackButton(this.sceneHistory.length > 0);
    }
    
    // Сохраняем ID сцены для возможного возврата после случайного события
    this.currentSceneId = sceneId;
    
    // Получаем сцену из сценария
    const scene = this.scenario[sceneId];
    if (!scene) {
      console.error(`Сцена с ID "${sceneId}" не найдена!`);
      return;
    }
    
    // Проверяем, нужно ли запустить случайное событие
    // Не запускаем случайные события при навигации назад
    if (!isBackNavigation && 
        !scene.isEnding && 
        !scene.onEnter && 
        Math.random() < CONFIG.randomEventChance) {
      this.triggerRandomEvent();
      return; // Прерываем загрузку сцены, сначала обработаем случайное событие
    }
    
    // Обновляем текущую сцену
    this.currentScene = scene;
    
    // Если это концовка, показываем экран концовки
    if (scene.isEnding) {
      console.log("Загружена концовка:", sceneId);
      
      // Если у сцены есть onEnter, вызываем его перед показом концовки
      if (scene.onEnter) {
        console.log("Вызываем onEnter для концовки");
        scene.onEnter(this);
      }
      
      // Обновляем фон и персонажей для последней сцены перед концовкой
      if (scene.background) {
        this.ui.elements.background.style.backgroundImage = `url(${scene.background})`;
      }
      
      this.ui.elements.charactersContainer.innerHTML = '';
      if (scene.character) {
        const characterImg = document.createElement('img');
        characterImg.src = scene.character;
        characterImg.classList.add('character');
        this.ui.elements.charactersContainer.appendChild(characterImg);
      }
      
      // Показываем последний диалог перед концовкой
      this.ui.elements.speakerName.textContent = scene.speaker || '';
      this.animateDialogText(scene.text);
      
      // Показываем концовку после небольшой задержки
      setTimeout(() => {
        this.showEnding();
      }, 3000);
      
      return;
    }
    
    // Обновляем фон
    if (scene.background) {
      this.ui.elements.background.style.backgroundImage = `url(${scene.background})`;
    }
    
    // Обновляем персонажа
    this.ui.elements.charactersContainer.innerHTML = '';
    if (scene.character) {
      const characterImg = document.createElement('img');
      characterImg.src = scene.character;
      characterImg.classList.add('character');
      this.ui.elements.charactersContainer.appendChild(characterImg);
    }
    
    // Обновляем диалог
    this.updateDialog();
    
    // Если у сцены есть onEnter, вызываем его
    if (scene.onEnter) {
      scene.onEnter(this);
    }
    
    console.log(`Сцена ${sceneId} загружена успешно`);
  }
  
  async animateDialogText(text) {
    this.isTextAnimating = true;
    
    try {
      await this.textManager.animateText(text);
      this.isTextAnimating = false;
      this.onTextAnimationComplete();
    } catch (error) {
      console.error('Ошибка при анимации текста:', error);
      this.textManager.showTextImmediately(text);
      this.isTextAnimating = false;
      this.onTextAnimationComplete();
    }
  }
  
  completeTextAnimation() {
    if (this.isTextAnimating) {
      this.textManager.showTextImmediately(this.currentScene.text);
      this.isTextAnimating = false;
      this.onTextAnimationComplete();
    }
  }
  
  onTextAnimationComplete() {
    if (this.currentScene.choices && this.currentScene.choices.length > 0) {
      this.updateChoices();
      this.ui.elements.choicesContainer.style.display = 'flex';
      this.ui.elements.continueButton.style.display = 'none';
    } else if (this.currentScene.nextScene) {
      this.ui.elements.continueButton.style.display = 'block';
    }
  }
  
  makeChoice(choice) {
    console.log("Выбран вариант:", choice.text, "Переход к:", choice.nextScene);
    
    // Дополнительная проверка перед применением эффектов
    if (choice.effects) {
      for (const stat in choice.effects) {
        const newValue = this.stats[stat] + choice.effects[stat];
        if (newValue <= 0) {
          console.error(`ОШИБКА: Выбор "${choice.text}" приведет к ${stat} <= 0. Этот выбор должен быть заблокирован!`);
          return; // Прерываем выполнение, не применяем эффекты
        }
      }
    }
    
    // Применяем эффекты к характеристикам
    if (choice.effects) {
      // Сохраняем старые значения для анимации
      const oldStats = {...this.stats};
      
      for (const [stat, value] of Object.entries(choice.effects)) {
        if (this.stats[stat] !== undefined) {
          // Применяем изменение
          this.stats[stat] += value;
          
          // Не даем характеристикам уйти в отрицательные значения
          if (this.stats[stat] < 0) {
            this.stats[stat] = 0;
          }
          
          // Анимируем изменение
          if (value !== 0) {
            this.ui.animateStatChange(stat, oldStats[stat], this.stats[stat]);
          }
          
          // Проверяем достижения при увеличении характеристик
          this.checkStatAchievements(stat, this.stats[stat]);
        }
      }
      
      this.ui.updateStats(this.stats);
    }
    
    // Переходим к следующей сцене
    this.loadScene(choice.nextScene);
  }
  
  triggerRandomEvent() {
    const event = getRandomEvent();
    
    // Создаем интерфейс случайного события
    const eventContainer = document.createElement('div');
    eventContainer.classList.add('random-event-container');
    eventContainer.innerHTML = `
      <div class="random-event-title">Случайное событие!</div>
      <div class="random-event-text">${event.text}</div>
      <div class="random-event-choices"></div>
    `;
    
    const choicesContainer = eventContainer.querySelector('.random-event-choices');
    
    event.choices.forEach(choice => {
      const button = document.createElement('button');
      button.classList.add('choice-button');
      button.textContent = choice.text;
      
      // Проверяем, не уйдет ли какая-то характеристика в 0
      let willMakeStatZero = false;
      let statThatWillBeZero = "";
      
      if (choice.effects) {
        for (const stat in choice.effects) {
          const newValue = this.stats[stat] + choice.effects[stat];
          if (newValue <= 0) {
            willMakeStatZero = true;
            statThatWillBeZero = stat;
            break;
          }
        }
      }
      
      if (willMakeStatZero) {
        button.classList.add('choice-button-disabled');
        button.disabled = true;
        
        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        tooltip.textContent = `Недостаточно ${this.getStatName(statThatWillBeZero)}`;
        button.appendChild(tooltip);
      } else {
        button.addEventListener('click', () => {
          // Применяем эффекты
          if (choice.effects) {
            // Сохраняем старые значения для анимации
            const oldStats = {...this.stats};
            
            for (const [stat, value] of Object.entries(choice.effects)) {
              if (this.stats[stat] !== undefined) {
                this.stats[stat] += value;
                if (this.stats[stat] < 0) this.stats[stat] = 0;
                
                // Анимируем изменение
                if (value !== 0) {
                  this.ui.animateStatChange(stat, oldStats[stat], this.stats[stat]);
                }
                
                // Проверяем достижения
                this.checkStatAchievements(stat, this.stats[stat]);
              }
            }
            
            // Обновляем отображение статистики
            this.ui.updateStats(this.stats);
          }
          
          // Закрываем событие и продолжаем игру
          eventContainer.classList.add('closing');
          setTimeout(() => {
            eventContainer.remove();
            // Продолжаем загрузку прерванной сцены
            this.loadScene(this.currentSceneId);
          }, 500);
        });
      }
      
      choicesContainer.appendChild(button);
    });
    
    document.body.appendChild(eventContainer);
    setTimeout(() => eventContainer.classList.add('active'), 100);
  }
  
  showEnding() {
    console.log("Показываем концовку:", this.endingTitle, this.endingMessage);
    
    // Проверяем, что у нас есть заголовок и сообщение для концовки
    if (!this.endingTitle && this.currentScene && this.currentScene.endingTitle) {
      this.endingTitle = this.currentScene.endingTitle;
    }
    
    if (!this.endingMessage && this.currentScene && this.currentScene.endingMessage) {
      this.endingMessage = this.currentScene.endingMessage;
    }
    
    // Устанавливаем заголовок и сообщение на экране концовки
    if (this.ui.elements.endTitle) {
      this.ui.elements.endTitle.textContent = this.endingTitle || "Конец игры";
    }
    
    if (this.ui.elements.endMessage) {
      this.ui.elements.endMessage.textContent = this.endingMessage || "Спасибо за игру!";
    }
    
    // Показываем экран концовки
    if (this.ui.elements.endScreen) {
      this.ui.elements.endScreen.style.display = 'flex';
    }
    
    // Останавливаем фоновую музыку или меняем на финальную
    if (this.backgroundMusic) {
      // Можно плавно уменьшить громкость перед остановкой
      const fadeOut = setInterval(() => {
        if (this.backgroundMusic.volume > 0.1) {
          this.backgroundMusic.volume -= 0.1;
        } else {
          clearInterval(fadeOut);
          this.backgroundMusic.pause();
        }
      }, 100);
    }
    
    // Сбрасываем текущую сцену
    this.currentScene = null;
    this.currentSceneId = null;
  }
  
  unlockAchievement(achievementId) {
    if (this.achievements[achievementId] && !this.achievements[achievementId].unlocked) {
      this.achievements[achievementId].unlocked = true;
      
      // Создаем уведомление о достижении
      const notification = document.createElement('div');
      notification.classList.add('achievement-notification');
      notification.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <div class="achievement-info">
          <div class="achievement-title">Достижение разблокировано!</div>
          <div class="achievement-name">${this.achievements[achievementId].title}</div>
          <div class="achievement-desc">${this.achievements[achievementId].description}</div>
        </div>
      `;
      
      this.achievementsContainer.appendChild(notification);
      
      // Анимация появления и исчезновения
      setTimeout(() => {
        notification.classList.add('show');
        
        // Звуковой эффект
        const achievementSound = new Audio('assets/audio/achievement.mp3');
        achievementSound.volume = 0.5;
        achievementSound.play().catch(e => {});
        
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => notification.remove(), 500);
        }, 3000);
      }, 100);
    }
  }
  
  changeRelationship(characterId, amount) {
    if (this.relationships[characterId]) {
      this.relationships[characterId].level += amount;
      
      // Ограничиваем значение отношений
      if (this.relationships[characterId].level > this.relationships[characterId].max) {
        this.relationships[characterId].level = this.relationships[characterId].max;
      }
      
      if (this.relationships[characterId].level < 0) {
        this.relationships[characterId].level = 0;
      }
      
      // Показываем уведомление об изменении отношений
      this.showRelationshipChange(characterId, amount);
    }
  }
  
  showRelationshipChange(characterId, amount) {
    if (amount === 0) return;
    
    const character = this.relationships[characterId];
    const notification = document.createElement('div');
    notification.classList.add('relationship-notification');
    
    const icon = amount > 0 ? '❤️' : '💔';
    const sign = amount > 0 ? '+' : '';
    
    notification.innerHTML = `
      <div class="relationship-icon">${icon}</div>
      <div class="relationship-info">
        <div class="relationship-name">${character.name}</div>
        <div class="relationship-change">${sign}${amount}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
      }, 2000);
    }, 100);
  }
  
  getStatName(stat) {
    switch(stat) {
      case 'time': return 'времени';
      case 'strength': return 'силы';
      case 'respect': return 'уважения';
      case 'charisma': return 'харизмы';
      default: return stat;
    }
  }
  
  checkStatAchievements(stat, value) {
    switch(stat) {
      case 'charisma':
        if (value >= 15 && this.achievements.charismatic && !this.achievements.charismatic.unlocked) {
          this.unlockAchievement('charismatic');
        }
        break;
      case 'strength':
        if (value >= 15 && this.achievements.strong && !this.achievements.strong.unlocked) {
          this.unlockAchievement('strong');
        }
        break;
      case 'respect':
        if (value >= 15 && this.achievements.teamPlayer && !this.achievements.teamPlayer.unlocked) {
          this.unlockAchievement('teamPlayer');
        }
        break;
      case 'time':
        if (value >= 15 && this.achievements.timeManager && !this.achievements.timeManager.unlocked) {
          this.unlockAchievement('timeManager');
        }
        break;
    }
  }
  
  updateDialog() {
    console.log("Обновление диалога:", this.currentScene.text);
    
    this.ui.elements.speakerName.textContent = this.currentScene.speaker || '';
    this.ui.elements.choicesContainer.innerHTML = '';
    this.ui.elements.choicesContainer.style.display = 'none';
    this.ui.elements.continueButton.style.display = 'none';
    
    // Анимируем текст диалога
    this.animateDialogText(this.currentScene.text);
  }
  
  // Добавим метод для обновления вариантов выбора
  updateChoices() {
    if (!this.currentScene.choices || this.currentScene.choices.length === 0) {
      this.ui.elements.choicesContainer.style.display = 'none';
      return;
    }
    
    this.ui.elements.choicesContainer.innerHTML = '';
    
    this.currentScene.choices.forEach(choice => {
      const button = document.createElement('button');
      button.classList.add('choice-button');
      button.textContent = choice.text;
      
      // Проверяем, не уйдет ли какая-то характеристика в 0
      let willMakeStatZero = false;
      let statThatWillBeZero = "";
      
      if (choice.effects) {
        for (const stat in choice.effects) {
          const newValue = this.stats[stat] + choice.effects[stat];
          if (newValue <= 0) {
            willMakeStatZero = true;
            statThatWillBeZero = stat;
            break;
          }
        }
      }
      
      if (willMakeStatZero) {
        button.classList.add('choice-button-disabled');
        button.disabled = true;
        
        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        tooltip.textContent = `Недостаточно ${this.getStatName(statThatWillBeZero)}`;
        button.appendChild(tooltip);
      } else {
        // Важно! Используем стрелочную функцию для сохранения контекста this
        button.addEventListener('click', () => {
          console.log("Кнопка нажата:", choice.text);
          this.makeChoice(choice);
        });
      }
      
      this.ui.elements.choicesContainer.appendChild(button);
    });
    
    this.ui.elements.choicesContainer.style.display = 'flex';
  }
  
  // Обновляем метод для возврата к предыдущей сцене
  goBack() {
    if (this.sceneHistory.length > 0) {
      console.log("Возврат к предыдущей сцене");
      
      // Получаем последнюю сцену из истории
      const previousSceneId = this.sceneHistory.pop();
      console.log("Предыдущая сцена:", previousSceneId);
      
      // Получаем предыдущие характеристики
      const previousStats = this.statsHistory.pop();
      console.log("Предыдущие характеристики:", previousStats);
      
      // Восстанавливаем предыдущие характеристики
      if (previousStats) {
        console.log("Текущие характеристики до восстановления:", {...this.stats});
        this.stats = {...previousStats};
        console.log("Характеристики после восстановления:", this.stats);
        this.ui.updateStats(this.stats);
      }
      
      // Загружаем предыдущую сцену без добавления в историю и без случайных событий
      this.loadScene(previousSceneId, false, true);
      
      // Обновляем видимость кнопки "Назад"
      this.ui.showBackButton(this.sceneHistory.length > 0);
      
      return true;
    }
    
    return false; // Нет истории для возврата
  }
  
  // Добавляем метод для отладки концовок
  debugEnding() {
    console.log("=== Отладка концовки ===");
    console.log("Текущая сцена:", this.currentScene);
    console.log("Текущие характеристики:", this.stats);
    console.log("Заголовок концовки:", this.endingTitle);
    console.log("Сообщение концовки:", this.endingMessage);
    console.log("=======================");
  }
} 