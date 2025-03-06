// Структура сценария:
// id: уникальный идентификатор сцены
// background: путь к фоновому изображению
// character: персонаж на экране (null для отсутствия)
// speaker: имя говорящего
// text: текст реплики
// choices: массив вариантов выбора, каждый из которых имеет:
//   - text: текст варианта
//   - nextScene: id следующей сцены
//   - effects: эффекты на характеристики (time, strength, respect, charisma)
// onEnter: функция, которая выполняется при входе в сцену (опционально)

const gameScenario = {
    // Начальная сцена
    "start": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Обычный день ученика 9 класса 1000 школы города Архангельска проходил как всегда...",
        choices: [],
        nextScene: "phone_call"
    },
    
    "phone_call": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "*звонит телефон*",
        choices: [],
        nextScene: "vojatiy_call"
    },
    
    "vojatiy_call": {
        background: "assets/images/room.jpg",
        character: "assets/images/vojatiy.jpg",
        speaker: "Вожатый",
        text: "Привет! У нас через пару дней сбор в палаточном лагере. Тебя назначили ответственным за вечернее мероприятие после твоего успеха на прошлом сборе. Приедешь?",
        choices: [
            {
                text: "Конечно! Я с радостью поеду!",
                nextScene: "accepted",
                effects: {
                    time: -1,
                    strength: 0,
                    respect: +1,
                    charisma: +1
                }
            },
            {
                text: "Нет, у меня выявили непереносимость горна",
                nextScene: "rejected",
                effects: {}
            }
        ]
    },
    
    "rejected": {
        background: "assets/images/room.jpg",
        character: "assets/images/vojatiy.jpg",
        speaker: "Вожатый",
        text: "Очень жаль. Придется искать другого ответственного. Выздоравливай!",
        choices: [],
        nextScene: "end_rejected"
    },
    
    "end_rejected": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Вы решили не ехать в лагерь. Возможно, это правильное решение... или нет?",
        choices: [],
        isEnding: true,
        endingTitle: "Конец: Домосед",
        endingMessage: "Вы остались дома и упустили возможность провести незабываемое время в лагере. Не всегда комфорт - лучший выбор."
    },
    
    "accepted": {
        background: "assets/images/room.jpg",
        character: "assets/images/png",
        speaker: "Вожатый",
        text: "Отлично! Сбор в субботу в 8 утра у школы. Не забудь подготовить что-нибудь интересное для вечернего мероприятия.",
        choices: [],
        nextScene: "packing"
    },
    
    "packing": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Впереди два дня на подготовку. Чем займешься сначала?",
        choices: [
            {
                text: "Подготовлю сценарий для вечернего мероприятия",
                nextScene: "prepare_event",
                effects: {
                    time: -2,
                    strength: 0,
                    respect: +2,
                    charisma: +1
                }
            },
            {
                text: "Соберу вещи и снаряжение",
                nextScene: "prepare_gear",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: 0,
                    charisma: 0
                }
            },
            {
                text: "Посмотрю фильмы и отдохну перед поездкой",
                nextScene: "relax",
                effects: {
                    time: -1,
                    strength: +2,
                    respect: -1,
                    charisma: 0
                }
            }
        ]
    },
    
    "prepare_event": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Ты провел большую часть дня, разрабатывая сценарий для вечернего мероприятия. У тебя получилось что-то интересное с игрой и конкурсами.",
        choices: [],
        nextScene: "day_before"
    },
    
    "prepare_gear": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Ты тщательно собрал все необходимые вещи, проверил снаряжение. Теперь ты полностью готов к выживанию в диких условиях лагеря.",
        choices: [],
        nextScene: "day_before"
    },
    
    "relax": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Ты решил хорошо отдохнуть перед сложными днями. Посмотрел пару фильмов и поиграл в компьютерные игры.",
        choices: [],
        nextScene: "day_before"
    },
    
    "day_before": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Наступил вечер перед отъездом. Что будешь делать?",
        choices: [
            {
                text: "Лягу спать пораньше, чтобы быть бодрым",
                nextScene: "early_sleep",
                effects: {
                    time: 0,
                    strength: +2,
                    respect: 0,
                    charisma: 0
                }
            },
            {
                text: "Доработаю детали мероприятия",
                nextScene: "final_prep",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: +2,
                    charisma: +1
                }
            },
            {
                text: "Пообщаюсь с друзьями по видеосвязи",
                nextScene: "friends_call",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: 0,
                    charisma: +2
                }
            }
        ]
    },

    "early_sleep": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Ты лег пораньше и хорошо выспался. Утром чувствуешь себя отдохнувшим и готовым к приключениям.",
        choices: [],
        nextScene: "departure_day"
    },
    
    "final_prep": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Ты допоздна отрабатывал все детали предстоящего мероприятия. Утром немного сонный, но уверенный в своей подготовке.",
        choices: [],
        nextScene: "departure_day"
    },
    
    "friends_call": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Ты провел вечер, общаясь с друзьями и обсуждая предстоящую поездку. Они дали тебе несколько интересных идей для мероприятия.",
        choices: [],
        nextScene: "departure_day"
    },
    
    "departure_day": {
        background: "assets/images/school.jpg",
        character: null,
        speaker: "",
        text: "День отъезда. Ты приходишь к школе, где уже собираются другие ребята и вожатые. Видишь знакомые лица.",
        choices: [],
        nextScene: "bus_arrival"
    },
    
    "bus_arrival": {
        background: "assets/images/school.jpg",
        character: "assets/images/vojatiy.jpg",
        speaker: "Вожатый",
        text: "Всем привет! Автобус прибудет через пару минут. Собираемся в группы по отрядам!",
        choices: [
            {
                text: "Подойти к своему старому отряду",
                nextScene: "old_team",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: +1,
                    charisma: 0
                }
            },
            {
                text: "Помочь вожатым с организацией",
                nextScene: "help_vojatiy",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: +2,
                    charisma: +1
                }
            },
            {
                text: "Держаться в стороне, пока все не соберутся",
                nextScene: "stay_aside",
                effects: {
                    time: 0,
                    strength: +1,
                    respect: -1,
                    charisma: -1
                }
            }
        ]
    },
    
    // Можно добавить больше сцен по аналогии
    
    // Простой финал для демонстрации
    "old_team": {
        background: "assets/images/camp.jpg",
        character: null,
        speaker: "",
        text: "Вы успешно добрались до лагеря и провели незабываемые дни.",
        choices: [],
        nextScene: "ending"
    },
    
    "help_vojatiy": {
        background: "assets/images/camp.jpg",
        character: null,
        speaker: "",
        text: "Вы успешно добрались до лагеря и провели незабываемые дни.",
        choices: [],
        nextScene: "ending"
    },
    
    "stay_aside": {
        background: "assets/images/camp.jpg",
        character: null,
        speaker: "",
        text: "Вы успешно добрались до лагеря и провели незабываемые дни.",
        choices: [],
        nextScene: "ending"
    },
    
    "ending": {
        background: "assets/images/camp.jpg",
        character: null,
        speaker: "",
        text: "Завершение лагерной смены. Как прошло твое мероприятие зависело от твоей подготовки и поведения.",
        choices: [],
        isEnding: true,
        onEnter: function(game) {
            // Определяем концовку на основе статистики
            if (game.stats.respect > 12 && game.stats.charisma > 12) {
                game.endingTitle = "Конец: Звезда лагеря";
                game.endingMessage = "Твое мероприятие было просто невероятным! Все были в восторге, и тебя запомнят как самого творческого организатора. Вожатые намекнули, что в следующем году тебя ждет повышение.";
            } else if (game.stats.respect > 10 && game.stats.charisma > 8) {
                game.endingTitle = "Конец: Хороший организатор";
                game.endingMessage = "Мероприятие прошло хорошо. Были недочеты, но в целом все остались довольны. Хороший опыт на будущее.";
            } else {
                game.endingTitle = "Конец: Первый блин комом";
                game.endingMessage = "Твое мероприятие не вызвало особого энтузиазма. Но это ценный опыт, и в следующий раз ты обязательно учтешь ошибки.";
            }
        }
    }
}; 