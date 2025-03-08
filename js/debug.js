// Функции для отладки
export function setupDebugTools(game) {
  // Добавляем кнопку для принудительного перехода к следующей сцене
  const debugPanel = document.createElement('div');
  debugPanel.style.position = 'fixed';
  debugPanel.style.top = '10px';
  debugPanel.style.right = '10px';
  debugPanel.style.zIndex = '9999';
  debugPanel.style.background = 'rgba(0,0,0,0.7)';
  debugPanel.style.padding = '10px';
  debugPanel.style.borderRadius = '5px';
  
  const debugButton = document.createElement('button');
  debugButton.textContent = 'Перейти к phone_call';
  debugButton.style.padding = '5px 10px';
  debugButton.style.marginRight = '5px';
  debugButton.addEventListener('click', () => {
    game.loadScene('phone_call');
  });
  
  debugPanel.appendChild(debugButton);
  document.body.appendChild(debugPanel);
  
  // Добавляем обработчик для отладки кликов
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('choice-button')) {
      console.log('Клик по кнопке выбора:', e.target.textContent);
    }
  }, true);
} 