// Утилиты
export class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
    return this;
  }
}

export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function animateText(element, text, speed = 30) {
  return new Promise((resolve, reject) => {
    try {
      element.textContent = '';
      let i = 0;
      
      const interval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, speed);
      
      // Добавляем возможность ускорения анимации при клике
      const speedUp = () => {
        clearInterval(interval);
        element.textContent = text;
        resolve();
      };
      
      element.addEventListener('click', speedUp, { once: true });
      
      // Очистка обработчика, если анимация завершилась нормально
      setTimeout(() => {
        element.removeEventListener('click', speedUp);
      }, text.length * speed + 100);
    } catch (error) {
      reject(error);
    }
  });
} 