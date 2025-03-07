// Удаляем весь код создания заглушек и замены путей
// Вместо этого используем реальные пути к изображениям

class VisualNovel {
    constructor(scenario) {
        this.scenario = scenario;
        this.currentScene = null;
        this.isTextAnimating = false;
        this.stats = {
            time: 0,
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
    }
    
    updateStatsDisplay() {
        if (this.timeElement) this.timeElement.textContent = this.stats.time;
        if (this.strengthElement) this.strengthElement.textContent = this.stats.strength;
        if (this.respectElement) this.respectElement.textContent = this.stats.respect;
        if (this.charismaElement) this.charismaElement.textContent = this.stats.charisma;
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
                this.completeTextAnimation();
            } else if (this.currentScene.nextScene) {
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
    
    preloadImages() {
        // Предзагрузка изображений для плавного отображения
        const imagesToPreload = [];
        
        // Собираем все уникальные пути к изображениям из сценария
        for (const sceneId in this.scenario) {
            const scene = this.scenario[sceneId];
            
            if (scene.background && !imagesToPreload.includes(scene.background)) {
                imagesToPreload.push(scene.background);
            }
            
            if (scene.character && !imagesToPreload.includes(scene.character)) {
                imagesToPreload.push(scene.character);
            }
        }
        
        // Предзагружаем изображения
        imagesToPreload.forEach(src => {
            if (src) {
                const img = new Image();
                img.src = src;
            }
        });
    }
    
    startGame() {
        this.startScreen.style.display = 'none';
        this.loadScene('start');
        
        // Запускаем фоновую музыку
        this.backgroundMusic.play().catch(e => {
            console.log('Автовоспроизведение музыки заблокировано браузером:', e);
        });
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
        this.currentScene = this.scenario[sceneId];
        
        if (!this.currentScene) {
            console.error(`Сцена с ID "${sceneId}" не найдена!`);
            return;
        }
        
        // Если это концовка, показываем экран концовки
        if (this.currentScene.isEnding) {
            // Если есть функция onEnter, вызываем ее
            if (typeof this.currentScene.onEnter === 'function') {
                this.currentScene.onEnter(this);
            }
            
            this.updateBackground();
            this.updateCharacters();
            this.updateDialog();
            
            setTimeout(() => {
                this.showEnding();
            }, 2000);
            
            return;
        }
        
        // Если есть функция onEnter, вызываем ее
        if (typeof this.currentScene.onEnter === 'function') {
            this.currentScene.onEnter(this);
        }
        
        this.updateBackground();
        this.updateCharacters();
        this.updateDialog();
    }
    
    updateBackground() {
        if (this.currentScene.background) {
            this.background.style.backgroundImage = `url(${this.currentScene.background})`;
        }
    }
    
    updateCharacters() {
        this.charactersContainer.innerHTML = "";
        
        if (this.currentScene.character) {
            const characterImg = document.createElement('img');
            characterImg.src = this.currentScene.character;
            characterImg.classList.add('character');
            this.charactersContainer.appendChild(characterImg);
        }
    }
    
    updateDialog() {
        this.speakerName.textContent = this.currentScene.speaker || '';
        this.dialogText.textContent = '';
        this.choicesContainer.style.display = 'none';
        this.continueButton.style.display = 'none';
        
        this.animateText(this.currentScene.text);
    }
    
    animateText(text) {
        this.isTextAnimating = true;
        let i = 0;
        let speed = 30; // миллисекунды между символами
        
        // Функции для ускорения и сброса скорости анимации
        this.speedUpText = () => {
            speed = 5;
        };
        
        this.resetSpeed = () => {
            speed = 30;
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
            // Создаем кнопку
            const button = document.createElement('button');
            button.classList.add('choice-button');
            button.textContent = choice.text;
            
            // Проверяем, не уйдет ли какая-то характеристика в 0 или ниже
            let willMakeStatZero = false;
            let statThatWillBeZero = "";
            
            // Проверяем эффекты выбора
            if (choice.effects) {
                // Проверяем каждую характеристику
                for (const stat in choice.effects) {
                    const currentValue = this.stats[stat];
                    const change = choice.effects[stat];
                    const newValue = currentValue + change;
                    
                    // Если новое значение <= 0, отмечаем, что выбор должен быть заблокирован
                    if (newValue <= 0) {
                        willMakeStatZero = true;
                        statThatWillBeZero = stat;
                        break;
                    }
                }
            }
            
            // Если выбор приведет к нулевой характеристике, блокируем кнопку
            if (willMakeStatZero) {
                button.classList.add('choice-button-disabled');
                button.disabled = true;
                
                // Добавляем подсказку
                const tooltip = document.createElement('span');
                tooltip.classList.add('tooltip');
                tooltip.textContent = `Недостаточно ${this.getStatName(statThatWillBeZero)}`;
                button.appendChild(tooltip);
            } else {
                // Добавляем обработчик клика для активной кнопки
                button.addEventListener('click', () => {
                    this.makeChoice(choice);
                });
            }
            
            this.choicesContainer.appendChild(button);
        });
    }
    
    // Вспомогательный метод для получения названия характеристики
    getStatName(stat) {
        const statNames = {
            'time': 'времени',
            'strength': 'сил',
            'respect': 'уважения',
            'charisma': 'харизмы'
        };
        return statNames[stat] || stat;
    }
    
    makeChoice(choice) {
        // Дополнительная проверка перед применением эффектов
        if (choice.effects) {
            for (const stat in choice.effects) {
                const newValue = this.stats[stat] + choice.effects[stat];
                if (newValue <= 0) {
                    return; // Прерываем выполнение, не применяем эффекты
                }
            }
        }
        
        // Применяем эффекты к характеристикам
        if (choice.effects) {
            for (const [stat, value] of Object.entries(choice.effects)) {
                if (this.stats[stat] !== undefined) {
                    this.stats[stat] += value;
                    
                    // Не даем характеристикам уйти в отрицательные значения
                    if (this.stats[stat] < 0) {
                        this.stats[stat] = 0;
                    }
                }
            }
            
            this.updateStatsDisplay();
        }
        
        // Переходим к следующей сцене
        this.loadScene(choice.nextScene);
    }
    
    showEnding() {
        // Получаем заголовок и сообщение концовки
        const endingTitle = this.currentScene.endingTitle || this.endingTitle;
        const endingMessage = this.currentScene.endingMessage || this.endingMessage;
        
        // Отображаем статистику в концовке
        let statsMessage = `<div class="ending-stats">
            <p>Итоговые характеристики:</p>
            <ul>
                <li>Время: ${this.stats.time}</li>
                <li>Силы: ${this.stats.strength}</li>
                <li>Уважение: ${this.stats.respect}</li>
                <li>Харизма: ${this.stats.charisma}</li>
            </ul>
        </div>`;
        
        // Устанавливаем заголовок и сообщение
        this.endTitle.textContent = endingTitle;
        this.endMessage.innerHTML = endingMessage + statsMessage;
        
        // Показываем экран концовки
        this.endScreen.style.display = 'flex';
    }
}

// Запуск игры после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const game = new VisualNovel(gameScenario);
}); 