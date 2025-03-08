// Точка входа в приложение
import { VisualNovel } from './game.js';
import { gameScenario } from './scenario.js';
import './textManager.js'; // Импортируем модуль для работы с текстом

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM загружен, инициализация игры...');
  
  // Создаем экземпляр игры
  const game = new VisualNovel(gameScenario);
  
  console.log('Игра инициализирована');
}); 