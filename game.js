// Удаляем весь код создания заглушек и замены путей
// Вместо этого используем реальные пути к изображениям

class VisualNovel {
    constructor(scenario) {
        this.scenario = scenario;
        this.currentScene = null;
        this.isTextAnimating = false;
        this.stats = {
            time: 10,
            strength: 10,
            respect: 10,
            charisma: 10
        };
        
        // DOM элементы
        this.dialogText = document.getElementById('dialog-text');
        this.speakerName = document.getElementById('speaker-name');
        this.choicesContainer = document.getElementById('choices-container');
        this.continueButton = document.getElementById('continue-button');
        this.background = document.querySelector('.background');
        this.charactersContainer = document.querySelector('.characters');
        this.startScreen = document.getElementById('start-screen');
        this.endScreen = document.getElementById('end-screen');
        this.endTitle = document.getElementById('end-title');
        this.endMessage = document.getElementById('end-message');
        
        // Статистика
        this.timeElement = document.getElementById('time');
        this.strengthElement = document.getElementById('strength');
        this.respectElement = document.getElementById('respect');
        this.charismaElement = document.getElementById('charisma');
        
        this.endingTitle = "";
        this.endingMessage = "";
        
        this.setupEventListeners();
        this.updateStatsDisplay();
        
        // Инициализация аудио и загрузка изображений
        this.initAudio();
        this.preloadImages();
        
        // Инициализируем статистику сразу после загрузки страницы
        setTimeout(() => {
            this.updateStatsDisplay();
        }, 100);
    }
    
    updateStatsDisplay() {
        // Добавляем проверку на существование элементов
        if (this.timeElement) this.timeElement.textContent = this.stats.time;
        if (this.strengthElement) this.strengthElement.textContent = this.stats.strength;
        if (this.respectElement) this.respectElement.textContent = this.stats.respect;
        if (this.charismaElement) this.charismaElement.textContent = this.stats.charisma;
        
        // Отладочная информация
        console.log("Обновление статистики:", this.stats);
    }
    
    setupEventListeners() {
        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restart-button').addEventListener('click', () => {
            this.restartGame();
        });
        
        this.continueButton.addEventListener('click', () => {
            if (this.isTextAnimating) {
                // Если текст еще анимируется, показать его полностью
                this.completeTextAnimation();
            } else if (this.currentScene.nextScene) {
                // Переход к следующей сцене
                this.loadScene(this.currentScene.nextScene);
            }
        });
    }
    
    initAudio() {
        this.backgroundMusic = new Audio('assets/audio/background.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        
        const audioButton = document.createElement('button');
        audioButton.classList.add('audio-control');
        audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        
        // Добавляем кнопку после создания панели статистики
        setTimeout(() => {
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
        }, 100);
    }
    
    preloadImages() {
        const imagePaths = new Set();
        Object.values(this.scenario).forEach(scene => {
            if (scene.background) imagePaths.add(scene.background);
            if (scene.character) imagePaths.add(scene.character);
        });
        
        imagePaths.forEach(path => {
            const img = new Image();
            img.src = path;
            console.log(`Загружаю изображение: ${path}`);
        });
    }
    
    startGame() {
        this.startScreen.style.display = 'none';
        
        // Начинаем воспроизведение музыки
        this.backgroundMusic.play().catch(err => {
            console.log('Автоматическое воспроизведение звука заблокировано браузером', err);
        });
        
        this.loadScene('start');
    }
    
    restartGame() {
        this.stats = {
            time: 10,
            strength: 10,
            respect: 10,
            charisma: 10
        };
        this.updateStatsDisplay();
        this.endScreen.style.display = 'none';
        this.loadScene('start');
    }
    
    loadScene(sceneId) {
        if (!this.scenario[sceneId]) {
            console.error(`Сцена "${sceneId}" не найдена!`);
            return;
        }
        
        this.currentScene = this.scenario[sceneId];
        
        // Выполняем onEnter функцию, если она существует
        if (this.currentScene.onEnter) {
            this.currentScene.onEnter(this);
        }
        
        // Проверяем, является ли сцена финальной
        if (this.currentScene.isEnding) {
            this.showEnding();
            return;
        }
        
        // Отладочная информация для проверки путей к изображениям
        console.log("Загрузка сцены:", sceneId);
        console.log("Фон:", this.currentScene.background);
        console.log("Персонаж:", this.currentScene.character);
        
        // Обновляем фон
        if (this.currentScene.background) {
            this.background.style.backgroundImage = `url('${this.currentScene.background}')`;
        }
        
        // Обновляем персонажа
        this.charactersContainer.innerHTML = '';
        if (this.currentScene.character) {
            const characterImg = document.createElement('img');
            characterImg.src = this.currentScene.character;
            characterImg.classList.add('character');
            // Добавляем обработчик клика для мгновенного завершения текста
            characterImg.addEventListener('click', (e) => {
                if (this.isTextAnimating) {
                    this.completeTextAnimation();
                    e.stopPropagation(); // Предотвращаем всплытие события
                }
            });
            this.charactersContainer.appendChild(characterImg);
        }
        
        // Добавляем обработчик клика на фон
        this.background.addEventListener('click', () => {
            if (this.isTextAnimating) {
                this.completeTextAnimation();
            }
        });
        
        // Очищаем и обновляем диалоговое окно
        this.speakerName.textContent = this.currentScene.speaker;
        this.dialogText.textContent = "";
        
        // Анимируем текст
        this.animateText(this.currentScene.text);
        
        // Обновляем варианты выбора
        this.updateChoices();
    }
    
    animateText(text) {
        this.isTextAnimating = true;
        this.continueButton.style.display = 'none';
        this.choicesContainer.style.display = 'none';
        this.dialogText.textContent = '';
        
        let i = 0;
        let speed = 30; // Начальная скорость печатания (мс на символ)
        
        // Сохраняем ссылки на функции-обработчики как свойства объекта
        this.speedUpText = () => {
            speed = 5; // Ускоренная скорость
        };
        
        this.resetSpeed = () => {
            speed = 30; // Нормальная скорость
        };
        
        this.completeAnimation = () => {
            if (this.isTextAnimating) {
                this.completeTextAnimation();
            }
        };
        
        // Добавляем обработчики событий
        document.addEventListener('mousedown', this.speedUpText);
        document.addEventListener('mouseup', this.resetSpeed);
        document.addEventListener('touchstart', this.speedUpText);
        document.addEventListener('touchend', this.resetSpeed);
        
        const typeWriter = () => {
            if (i < text.length) {
                this.dialogText.textContent += text.charAt(i);
                i++;
                this.textAnimationTimeout = setTimeout(typeWriter, speed);
            } else {
                this.isTextAnimating = false;
                this.onTextAnimationComplete();
                
                // Удаляем обработчики событий
                document.removeEventListener('mousedown', this.speedUpText);
                document.removeEventListener('mouseup', this.resetSpeed);
                document.removeEventListener('touchstart', this.speedUpText);
                document.removeEventListener('touchend', this.resetSpeed);
            }
        };
        
        typeWriter();
    }
    
    completeTextAnimation() {
        if (this.textAnimationTimeout) {
            clearTimeout(this.textAnimationTimeout);
        }
        
        // Удаляем все обработчики событий, связанные с анимацией
        document.removeEventListener('mousedown', this.speedUpText);
        document.removeEventListener('mouseup', this.resetSpeed);
        document.removeEventListener('touchstart', this.speedUpText);
        document.removeEventListener('touchend', this.resetSpeed);
        
        this.isTextAnimating = false;
        this.dialogText.textContent = this.currentScene.text;
        this.onTextAnimationComplete();
    }
    
    onTextAnimationComplete() {
        if (this.currentScene.choices && this.currentScene.choices.length > 0) {
            this.updateChoices();
            this.choicesContainer.style.display = 'flex';
        } else if (this.currentScene.nextScene) {
            this.continueButton.style.display = 'block';
        }
    }
    
    updateChoices() {
        this.choicesContainer.innerHTML = "";
        
        if (!this.currentScene.choices || this.currentScene.choices.length === 0) {
            return;
        }
        
        this.currentScene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('choice-button');
            button.textContent = choice.text;
            
            button.addEventListener('click', () => {
                this.makeChoice(choice);
            });
            
            this.choicesContainer.appendChild(button);
        });
    }
    
    makeChoice(choice) {
        // Применяем эффекты к характеристикам
        if (choice.effects) {
            for (const [stat, value] of Object.entries(choice.effects)) {
                if (this.stats[stat] !== undefined) {
                    this.stats[stat] += value;
                    // Не даем характеристикам уйти в отрицательные значения
                    if (this.stats[stat] < 0) this.stats[stat] = 0;
                }
            }
            this.updateStatsDisplay();
        }
        
        // Переходим к следующей сцене
        this.loadScene(choice.nextScene);
    }
    
    showEnding() {
        this.endTitle.textContent = this.currentScene.endingTitle || this.endingTitle;
        this.endMessage.textContent = this.currentScene.endingMessage || this.endingMessage;
        this.endScreen.style.display = 'flex';
    }
}

// Запуск игры после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const game = new VisualNovel(gameScenario);
}); 