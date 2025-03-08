// Менеджер для работы с текстом
export class TextManager {
  constructor(dialogElement) {
    this.dialogElement = dialogElement;
    this.isAnimating = false;
    this.currentText = '';
    this.animationSpeed = 30; // миллисекунды между символами
    this.animationInterval = null;
  }
  
  // Анимация текста с возможностью ускорения и отмены
  animateText(text) {
    const processedText = this.preprocessText(text);
    
    return new Promise((resolve) => {
      // Очищаем предыдущую анимацию, если она была
      this.stopAnimation();
      
      this.isAnimating = true;
      this.currentText = processedText;
      this.dialogElement.innerHTML = ''; // Используем innerHTML вместо textContent
      
      // Если текст содержит HTML-теги, используем другой подход
      if (processedText.includes('<')) {
        // Разбиваем текст на части (теги и текст)
        const parts = processedText.split(/(<[^>]*>)/);
        let charIndex = 0;
        let partIndex = 0;
        
        const animateNextChar = () => {
          if (partIndex >= parts.length) {
            this.stopAnimation();
            this.isAnimating = false;
            resolve();
            return;
          }
          
          const part = parts[partIndex];
          
          // Если это тег, добавляем его целиком
          if (part.startsWith('<')) {
            this.dialogElement.innerHTML += part;
            partIndex++;
            animateNextChar();
          } 
          // Если это текст, добавляем по одному символу
          else {
            if (charIndex < part.length) {
              this.dialogElement.innerHTML += part.charAt(charIndex);
              charIndex++;
              this.animationInterval = setTimeout(animateNextChar, this.animationSpeed);
            } else {
              charIndex = 0;
              partIndex++;
              animateNextChar();
            }
          }
        };
        
        animateNextChar();
      } 
      // Обычная анимация для текста без тегов
      else {
        let charIndex = 0;
        
        this.animationInterval = setInterval(() => {
          if (charIndex < processedText.length) {
            this.dialogElement.textContent += processedText.charAt(charIndex);
            charIndex++;
          } else {
            this.stopAnimation();
            this.isAnimating = false;
            resolve();
          }
        }, this.animationSpeed);
      }
      
      // Функция для ускорения анимации
      const completeAnimation = () => {
        this.stopAnimation();
        this.dialogElement.innerHTML = processedText;
        this.isAnimating = false;
        resolve();
      };
      
      // Добавляем обработчик клика для ускорения
      this.dialogElement.addEventListener('click', completeAnimation, { once: true });
    });
  }
  
  // Остановка текущей анимации
  stopAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    
    this.isAnimating = false;
  }
  
  // Мгновенное отображение текста
  showTextImmediately(text) {
    this.stopAnimation();
    this.dialogElement.textContent = text;
    this.currentText = text;
  }
  
  // Добавьте этот метод в класс TextManager
  preprocessText(text) {
    // Заменяем звездочки на теги <em> для выделения
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Заменяем двойные пробелы на одинарные
    text = text.replace(/\s{2,}/g, ' ');
    
    // Заменяем неразрывные пробелы на обычные
    text = text.replace(/\u00A0/g, ' ');
    
    return text;
  }
} 