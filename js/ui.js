// Компоненты пользовательского интерфейса
import { EventEmitter } from './utils.js';

export class UIManager extends EventEmitter {
  constructor() {
    super();
    this.elements = {
      dialogText: document.getElementById('dialog-text'),
      speakerName: document.getElementById('speaker-name'),
      choicesContainer: document.getElementById('choices-container'),
      continueButton: document.getElementById('continue-button'),
      background: document.querySelector('.background'),
      charactersContainer: document.querySelector('.characters'),
      startScreen: document.getElementById('start-screen'),
      endScreen: document.getElementById('end-screen'),
      endTitle: document.getElementById('end-title'),
      endMessage: document.getElementById('end-message'),
      timeElement: document.getElementById('time'),
      strengthElement: document.getElementById('strength'),
      respectElement: document.getElementById('respect'),
      charismaElement: document.getElementById('charisma'),
      backButton: document.getElementById('back-button') || this.createBackButton()
    };
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    document.getElementById('start-button').addEventListener('click', () => {
      this.emit('gameStart');
    });
    
    document.getElementById('restart-button').addEventListener('click', () => {
      this.emit('gameRestart');
    });
    
    this.elements.continueButton.addEventListener('click', () => {
      this.emit('continueClicked');
    });
    
    this.elements.backButton.addEventListener('click', () => {
      this.emit('backClicked');
    });
  }
  
  updateStats(stats) {
    const { time, strength, respect, charisma } = stats;
    
    this.updateStatElement(this.elements.timeElement, time, time <= 3);
    this.updateStatElement(this.elements.strengthElement, strength, strength <= 3);
    this.updateStatElement(this.elements.respectElement, respect, respect <= 3);
    this.updateStatElement(this.elements.charismaElement, charisma, charisma <= 3);
  }
  
  updateStatElement(element, value, isCritical) {
    if (!element) return;
    
    element.textContent = value;
    if (isCritical) {
      element.classList.add('critical-stat');
    } else {
      element.classList.remove('critical-stat');
    }
  }
  
  animateStatChange(stat, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    let element;
    switch(stat) {
      case 'time': element = this.elements.timeElement; break;
      case 'strength': element = this.elements.strengthElement; break;
      case 'respect': element = this.elements.respectElement; break;
      case 'charisma': element = this.elements.charismaElement; break;
      default: return;
    }
    
    if (!element) return;
    
    const changeElement = document.createElement('span');
    changeElement.classList.add('stat-change');
    
    if (newValue > oldValue) {
      changeElement.textContent = `+${newValue - oldValue}`;
      changeElement.classList.add('stat-increase');
    } else {
      changeElement.textContent = `-${oldValue - newValue}`;
      changeElement.classList.add('stat-decrease');
    }
    
    const statElement = element.closest('.stat');
    if (statElement) {
      statElement.appendChild(changeElement);
    } else {
      element.parentNode.insertBefore(changeElement, element.nextSibling);
    }
    
    setTimeout(() => {
      changeElement.classList.add('animate');
      setTimeout(() => changeElement.remove(), 1000);
    }, 10);
  }
  
  updateChoices(choices, makeChoiceCallback) {
    this.elements.choicesContainer.innerHTML = '';
    
    if (!choices || choices.length === 0) {
      this.elements.choicesContainer.style.display = 'none';
      return;
    }
    
    choices.forEach(choice => {
      const button = document.createElement('button');
      button.classList.add('choice-button');
      button.textContent = choice.text;
      
      button.addEventListener('click', () => {
        makeChoiceCallback(choice);
      });
      
      this.elements.choicesContainer.appendChild(button);
    });
    
    this.elements.choicesContainer.style.display = 'flex';
  }
  
  createBackButton() {
    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.classList.add('back-button');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Назад';
    backButton.style.display = 'none';
    
    document.body.insertBefore(backButton, document.body.firstChild);
    
    return backButton;
  }
  
  showBackButton(show) {
    if (this.elements.backButton) {
      this.elements.backButton.style.display = show ? 'block' : 'none';
    }
  }
  
  // Другие методы UI...
} 