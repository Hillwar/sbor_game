// Конфигурация игры
export const CONFIG = {
  initialStats: {
    time: 10,
    strength: 10,
    respect: 10,
    charisma: 10
  },
  achievements: {
    "organizer": { title: "Организатор", description: "Успешно провести мероприятие", unlocked: false },
    "teamPlayer": { title: "Командный игрок", description: "Заработать уважение команды", unlocked: false },
    "timeManager": { title: "Мастер времени", description: "Сохранить баланс между подготовкой и отдыхом", unlocked: false },
    "charismatic": { title: "Душа компании", description: "Развить харизму до 15+", unlocked: false },
    "strong": { title: "Железный человек", description: "Развить силу до 15+", unlocked: false }
  },
  relationships: {
    "vojatiy": { name: "Вожатый", level: 5, max: 10 },
    "misha": { name: "Миша", level: 5, max: 10 },
    "sveta": { name: "Света", level: 5, max: 10 },
    "otryadLeader": { name: "Ответственный за отряд", level: 5, max: 10 }
  },
  randomEventChance: 0.1
}; 