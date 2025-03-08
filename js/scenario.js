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

// Экспортируем сценарий как модуль
export const gameScenario = {
    // Начальная сцена
    "start": {
        background: "assets/images/camp.jpg",
        character: null,
        speaker: "",
        text: "Добро пожаловать в лагерь! Ты - старик, и тебе предстоит провести незабываемую смену.",
        choices: [
            {
                text: "Начать приключение",
                nextScene: "phone_call",
                effects: {}
            }
        ]
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
        text: "Привет! Ты ездил на Сбор в прошлом году, и мы хотели бы узнать, планируешь ли ты участвовать в подготовке и поехать в лагерь в этом году?",
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
        background: "",
        character: "",
        speaker: "Вожатый",
        text: "Очень жаль. Выздоравливай!",
        choices: [],
        nextScene: "end_rejected"
    },
    
    "end_rejected": {
        background: "",
        character: null,
        speaker: "",
        text: "Вы решили не ехать в лагерь. Возможно, это правильное решение... или нет?",
        choices: [],
        isEnding: true,
        endingTitle: "Конец: Домосед",
        endingMessage: "Вы остались дома и упустили возможность провести незабываемое время в лагере. Не всегда комфорт - лучший выбор."
    },
    
    "accepted": {
        background: "",
        character: "",
        speaker: "Вожатый",
        text: "Отлично! До скорых встреч.",
        choices: [],
        nextScene: "afterOSSH"
    },
    "afterOSSH": {
        background: "",
        character: "",
        speaker: "",
        text: "Прошло 2 недели. Стариуса распределили в стариковский отряд и добавили в беседу отряда.",
        choices: [],
        nextScene: "oinv1.1"
    },
    "oinv1.1": {
        background: "",
        character: "",
        speaker: "",
        text: "*приходит уведомление в чате в тг*",
        choices: [],
        nextScene: "oinv1.2"
    },
    "oinv1.2": {
        background: "",
        character: null,
        speaker: "Ответственный за отряд",
        text: "Привет! Уже в это воскресенье в 16:00 состоится 1-ый стариковский отряд! Подскажи, пожалуйста, будешь ли ты на отряде?",
        choices: [
            {
                text: "Отвечу на сообщение и приду",
                nextScene: "otryd1",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: +1,
                    charisma: 0
                }
            },
            {
                text: "Приду, но не напишу. А зачем? Я же уже сказал своему другу Мише.",
                nextScene: "otryd1",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: -1,
                    charisma: +1
                }
            },
            {
                text: "Не приду",
                nextScene: "1osy",
                effects: {
                    time: +1,
                    strength: 0,
                    respect: -1,
                    charisma: 0
                }
            }
        ]
    },
    
    "otryd1": {
        background: "",
        character: null,
        speaker: "",
        text: "На отряде обсуждается подготовкка бейджиков новеньким на 1ОСУ. Никто не хочет взять поручение, обращаются к тебе. Как ты поступишь?",
        choices: [
            {
                text: "Возьмусь",
                nextScene: "pomposhki",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: +1,
                    charisma: +1
                }
            },
            {
                text: "Не смогу. У меня всю неделю сбор гербария.",
                nextScene: "odnoklassnik",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            }
        ],
    },
    "odnoklassnik": {
        background: "",
        character: null,
        speaker: "Вожатый",
        text: "Сбор - это люди, именно поэтому важно, чтобы как можно больше новыхз людей захотели поехать на Сбор. Зовите друзей и своих одноклассников обязательно!",
        choices: [
            {
                text: "Не хочу я приглашать своего одноклассника, что он забыл на Сборе",
                nextScene: "pomposhki",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -1,
                    charisma: -1
                }
            },
            {
                text: "Обязательно предложу всем",
                nextScene: "pomposhki",
                effects: {
                    time: -2,
                    strength: -1,
                    respect: +2,
                    charisma: +1
                }
            }
        ],
    },
    
    "pomposhki": {
        background: "",
        character: null,
        speaker: "",
        text: "После отряда к тебе подходит твой товарищ по отряду Петя.",
        choices: [],
        nextScene: "dialog_Petya"
    },
    
    "dialog_Petya": {
        background: "",
        character: null,
        speaker: "Петя",
        text: "Привет! Мне поручили сделать бейджики и подготовить основы для изготовления помпошек.  Но честно, меня не было на 1 ОСУ в прошлом году,ия не понимаю, что за основы и какие нитки нужны. Мулине подойдут?",
        choices: [],
        nextScene: "dialog_Petya_2"
    },
    "dialog_Petya": {
        background: "",
        character: null,
        speaker: "",
        text: "Ты понимаешь, что Петя не справитсяб. В целом, у тебя есть свободное время... Как ты поступишь? ",
        choices: [
            {
                text: "Предложу сходить за нитками вместе",
                nextScene: "1osy",
                effects: {
                    time: 0,
                    strength: -1,
                    respect: 0,
                    charisma: +1
                }
            },
            {
                text: "Пойду домой спать",
                nextScene: "1osy",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            },
            {
                text: "Куплю сам. Он не справится",
                nextScene: "1osy",
                effects: {
                    time: 0,
                    strength: -2,
                    respect: 0,
                    charisma: -1
                }
            }
        ]
    },
    "1osy": {
        background: "",
        character: null,
        speaker: "",
        text: "Прошли все стариковские отряды. отрядная игрушка выбрана, помпошки подготовлены, бейджики выглядят прекрасно. Уже завтра 1ОСУ.",
        choices: [],
        nextScene: "1osy1.2"
    },

"1osy1.2": {
    background: "",
    character: null,
    speaker: "",
    text: "По традиции 1ОСУ начинается со знакомства с новенькими. Все общаются, улыбаются и смеются.",
    choices: [],
    nextScene: "1osy1.3"
},
    "1osy1.3": {
        background: "",
        character: null,
        speaker: "",
        text: "Но тут ты замечаешь, что один новый участник стоит в отдалении, не особо с кем-то разговаривает. Что будешь делать?",
        choices: [
            {
                text: "Подойду и заговорю",
                nextScene: "talk_to_new_participant",
                effects: {
                    time: 0,
                    strength: -1,
                    respect: +1,
                    charisma: +1
                }
            },
            {
                text: "Не подойду. У меня все мысли в завтрашней контрольной",
                nextScene: "samprishol1",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            },
        ]
    },
    "samprishol1": {
        background: "",
        character: null,
        speaker: "",
        text: "Новенкий сам тебя заметил и идет к тебе. Что будешь делать?",
        choices: [
            {
                text: "Поговорить с ним",
                nextScene: "otryd2",
                effects: {
                    time: 0,
                    strength: -1,
                    respect: 0,
                    charisma: +1
                }
            },
            {
                text: "Сбежать",
                nextScene: "otryd2",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -1,
                    charisma: -2
                }
            }   
        ],
        nextScene: "talk_to_new_participant_2"
    },
    "talk_to_new_participant_2": {
        background: "",
        character: null,
        speaker: "Альберт",
        text: "Моя мама была штабисткой. Она была старшей барабанщицей. У меня дома даже фотография есть",
        nextScene: "talk_to_new_participant_3"
    },
    "talk_to_new_participant_3": {
        background: "",
        character: null,
        speaker: "Ты",
        text: "Вот это да!",
        choices: [
            {
                text: "А ты чем увлекаешься? Мечтал когда-нибудь играть на барабанах?",
                nextScene: "talk_to_new_participant_4",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            },
            {
                text: "Пока! Было приятно познакомиться! Меня ждет мой друг, я к нему пойду",
                nextScene: "otryd2",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: +1
                }
            }
        ],
        nextScene: "talk_to_new_participant_4"
    },
    "talk_to_new_participant_4": {
        background: "",
        character: null,
        speaker: "Альберт",
        text: "Я хожу в музыкальную школу и играю на гитаре. Барабаны мне не подходят, они громкие. Я хочу научиться играть на трубе, но не знаю, как это сделать.",
        choices: [],
        nextScene: "talk_to_new_participant_5"
    },
    "talk_to_new_participant_5": {
        background: "",
        character: null,
        speaker: "Ты",
        text: "Есть у меня ощущение, что на сборе твои мечты могут осуществиться.",
        choices: [
            {
                text: "Продолжить диалог с Альбертом",
                nextScene: "otryd2",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: 0,
                    charisma: +1
                }
            },
            {
                text: "Пойти поговорить с другим новеньким",
                nextScene: "otryd2",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            }
        ],
        nextScene: "final_prep"
    },
    "otryd2": {
        background: "",
        character: null,
        speaker: "",
        text: "Тебе пришло сообщение с приглашением на отряд. Пойдешь?",
        choices: [
            {
                text: "Конечно!",
                nextScene: "otryd2.1",
                effects: {
                    time: -1,
                    strength: 0,
                    respect: +1,
                    charisma: 0
                }
            },
            {
                text: "Не пойду. У меня репетитор.",
                nextScene: "otryd3",
                effects: {
                    time: +1,
                    strength: +1,
                    respect: -1,
                    charisma: 0
                }
            }
        ],
    },
    
    "otryd2.1": {
        background: "assets/images/room.jpg",
        character: null,
        speaker: "",
        text: "Отряд был посвящен теме Сбор. По ходу обсуждения, большинство пришло к выводу, что Сбор - это место, где можно провести свое лучшее лето. Ты не согласен с этим мнением. Что скажешь?",
        choices: [
            {
                text: "Начну отстаивать свою позицию",
                nextScene: "tryd1",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: -1,
                    charisma: +1
                }
            },
            {
                text: "Соглашусь со всеми. Тут нет ничего критичного.",
                nextScene: "tryd1",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            }
        ],
    },
    
    "tryd1": {
        background: "",
        character: null,
        speaker: "",
        text: "Отряд подощел к концу. После отряда все решили вместе выпить чаю.",
        choices: [],
        nextScene: "tryd2"
    },
    
    "tryd2": {
        background: "",
        character: null,
        speaker: "Новенькая (Света)",
        text: "Слушай, а чтот такое трудовые? На отряде услышала, но ничего не поняла. Что вы там делаете?",
        choices: [
            {
                text: "Я бы ответил, ...",
                nextScene: "otryd3",
                effects: {
                    time: -1,
                    strength: 0,
                    respect: +2,
                    charisma: +1
                }
            },
        ],
    },
    "otryd3": {
        background: "",
        character: null,
        speaker: "Ответственный за отряд",
        text: "Привет! В пятницу в 17:00 пройдет следующий отряд. Ты будешь?",
        choices: [
            {
                text: "Конечно!",
                nextScene: "otryd3.1",
                effects: {
                    time: -1,
                    strength: 0,
                    respect: +1,
                    charisma: 0
                }
            },
            {
                text: "Не смогу",
                nextScene: "otryd4",
                effects: {
                    time: +1,
                    strength: +1,
                    respect: -1,
                    charisma: 0
                }
            }
        ],
        
    },
    "otryd3.1": {
        background: "",
        character: null,
        speaker: "",
        text: "В самом начале отряда появляется Полина - ответственная за тематическую службу.",
        choices: [],
        nextScene: "otryd3.2"
    },
    "otryd3.2": {
        background: "",
        character: null,
        speaker: "Полина",
        text: "Ребята, требуется срочно помочь с документами. Есть кто-то, кто готов?",
        choices: [
            {
                text: "Готов!",
                nextScene: "otryd3.3",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: +1,
                    charisma: 0
                }
            },
            {
                text: "А что нужно сделать?",
                nextScene: "otryd3.3",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            },
            {
                text: "Промолчать",
                nextScene: "otryd3.4",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            },
            {
                text: "*Многозадачно посмотреть на друга*",
                nextScene: "otryd3.4",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            }
        ],
    },

    "otryd3.3": {
        background: "",
        character: null,
        speaker: "Полина",
        text: "Необходимо отвезти документы на 25-ый лесозавод. Ты готов?",
        choices: [
            {
                text: "Хорошо",
                nextScene: "otryd3.4",
                effects: {
                    time: -2,
                    strength: -1,
                    respect: +1,
                    charisma: 0
                }
            },
            {
                text: "Я там не был ни разу. Страшновато",
                nextScene: "otryd3.4",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: -1
                }
            }
        ],
    },

    "otryd3.4": {
        background: "",
        character: null,
        speaker: "",
        text: "Полина ушла. Отряд продолжается. На отряде выяснидлось, что от группы по подготовке ко ВСиПу поступило задание. Необходимо выбрать ответственного.",
        choices: [
            {
                text: "Готов взяться за задание",
                nextScene: "dialog1",
                effects: {
                    time: -2,
                    strength: -2,
                    respect: +2,
                    charisma: 0
                }
            },
            {
                text: "Не готов взяться за задание",
                nextScene: "dialog1",
                effects: {
                    time: +1,
                    strength: +1,
                    respect: 0,
                    charisma: 0
                }
            },
        ]
    },
    
    "dialog1": {
        background: "",
        character: null,
        speaker: "",
        text: "После отряда. Глубокая ночь.",
        choices: [],
        nextScene: "dialog2"
    },
    
    "dialog2": {
        background: "",
        character: null,
        speaker: "",
        text: "Двое новеньких-одноклассников ведут оживленную дискуссию в беседе отряда. В ходе диалога один из собеседников неккоректно обратился к другому.",
        choices: [],
        nextScene: "dialog3"
    },
    
    "dialog3": {
        background: "",
        character: null,
        speaker: "Новнький в беседе",
        text: "Эй ты, зеленый! Ты идешь завтра на отряд?",
        choices: [],
        nextScene: "dialog4"
    },

    "dialog4": {
        background: "",
        character: null,
        speaker: "",
        text: "Глубокая ночь, вожатых нет онлайн. Что ты будешь делать?",
        choices: [
            {
                text: "Напишу вожатому, обращу его внимание на ситуацию",
                nextScene: "otryad4",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: -1
                }
            },
            {
                text: "Промолчу",   
                nextScene: "otryad4",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -1,
                    charisma: 0
                }
            },
            {
                text: "Напишу лично, чтобы решить ситуацию",
                nextScene: "otryad4",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: +1,
                    charisma: +1
                }
            },
            {
                text: "Напишу в беседе",
                nextScene: "otryad4",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: +2,
                    charisma: +1
                }
            }
        ],
    },
    
    "otryad4": {
        background: "",
        character: null,
        speaker: "Ответственный за отряд",
        text: "Привет! Ты будешь завтра на отряде?",
        choices: [
            {
                text: "Конечно!",
                nextScene: "otryad5",
                effects: {
                    time: -1,
                    strength: 0,
                    respect: +1,
                    charisma: 0
                }
            },
            {
                text: "Не смогу. У меня группа по мероприятию",
                nextScene: "otryd4.2",
                effects: {
                    time: 0,
                    strength: +1,
                    respect: 0,
                    charisma: +1
                }
            }
        ],
    },
    
    "otryd4.2": {
        background: "",
        character: null,
        speaker: "",
        text: "На отряд пришла Вероника - ответственная за службу Атрибутика. В отряде необходимо выбрать кого-то в отряд горнистов. Кого ты можешь предложить в качестве кандидата из тех, кого нет на отряде?",
        choices: [
            {
                text: "Маша",
                nextScene: "otryd4.3",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            },
            {
                text: "Сергей",
                nextScene: "otryd4.3",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            },
            {
                text: "Арина",
                nextScene: "otryd4.3",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            },
            {
                text: "Альберт",
                nextScene: "otryd4.4",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            }
        ],
    },
    
    "otryd4.3": {
        background: "",
        character: null,
        speaker: "",
        text: "После отряда Вероника позвонила предложенному кандидату. К сожалению, он отказался.?",
        choices: [
            {
                text: "К сожалению, ты не знаешь об интересах ребят в отряде",
                nextScene: "otryd5",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: 0,
                    charisma: 0
                }
            }
        ],
    },
    "otryd4.4": {
        background: "",
        character: null,
        speaker: "",
        text: "После отряда Вероника позвонила Альберту и предложила вступить в отряд горнистов. Он с радостью согласился, ведь мечтал научиться играть на трубе",
        choices: [
            {
                text: "Поздравить Альберта с вступлением в отряд горнистов",
                nextScene: "otryd5",
                effects: {
                    time: +1,
                    strength: 0,
                    respect: 0,
                    charisma: +1
                }
            },        
        ],
    },
    "otryd5": {
        background: "",
        character: null,
        speaker: "",
        text: "После орлятского круга вы с другом идете за куртками. В очередной раз твой друг отмечает, что не собирается застегивать рубашку в орлятском круге, потому что ему будет жарко. Какими будут твои действия?",
        choices: [
            {
                text: "Сделать замечание",
                nextScene: "otryd6",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: 0,
                    charisma: -2
                }
            },
            {
                text: "Объяснить, почему так нельзя делать",
                nextScene: "otryd6",
                effects: {
                    time: 0,
                    strength: -1,
                    respect: +2,
                    charisma: -1
                }
            },
            {
                text: "Промолчать",
                nextScene: "otryd6",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -2,
                    charisma: 0
                }
            },
            {
                text: "Поддержать друга",
                nextScene: "otryd6",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -4,
                    charisma: +2
                }
            }
        ],
    },
    
    "otryd6": {
        background: "",
        character: null,
        speaker: "Ответственный за отряд",
        text: "Привет! Мы на финишной прямой. Осталось всего пару отрядов. Ты придешь?",
        choices: [
            {
                text: "Конечно!",
                nextScene: "otryd6.1",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: +1,
                    charisma: +1
                }   
            },
            {
                text: "Не хочу",
                nextScene: "otryd7",
                effects: {
                    time: +1,
                    strength: +2,
                    respect: -2,
                    charisma: -2
                }
            }
        ]
    },
    
    "otryd6.1": {
        background: "",
        character: null,
        speaker: "",
        text: "Начинаются активные поездки на трудовые. Тебе предлагают поехать, но ты сможешь присоединиться только в суььоту. Стоит ли искать возможность доехать?",
        choices: [
            {
                text: "Задай 3 наводящих вопроса для принятия решения",
                nextScene: "otryd6.2",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: +1,
                    charisma: 0
                }
            }
        ]
    },
    "otryd6.2": {
        background: "",
        character: null,
        speaker: "",
        text: "Поедешь на трудовую?",
        choices: [
            {
                text: "Да",
                nextScene: "otryd6.3",
                effects: {
                    time: -3,
                    strength: -2,
                    respect: +2,
                    charisma: +1
                }
            },
            {
                text: "Нет",
                nextScene: "otryd6.4",
                effects: {
                    time: +1,
                    strength: +1,
                    respect: -1,
                    charisma: 0
                }
            }
        ]
    },
    "otryd6.4": {
        background: "",
        character: null,
        speaker: "",
        text: "Тебе было поручено подготовить к отряду рассказ о книге Судьба барабанщика. Ты об этом совсем забыл. Наступил день отряда, сегодня нужно рассказать о выполненном поручении. Что будешь делать?",
        choices: [
            {
                text: "Рассказать правду",
                nextScene: "otryd7",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -1,
                    charisma: +2
                }
            },
            {
                text: "Импровизировать",
                nextScene: "otryd7",
                effects: {
                    time: 0,
                    strength: -1,
                    respect: -1,
                    charisma: +1
                }
            },
            {
                text: "Сказать, что тебе не напомнили",
                nextScene: "otryd7",
                effects: {
                    time: -1,
                    strength: 0,
                    respect: -2,
                    charisma: -1
                }
            }
        ]
    },
    
    "otryd6.3": {
        background: "",
        character: null,
        speaker: "",
        text: " Наступили выходные. Ты собрал сумки и поехал на Копачевскую поляну, на трудовую.",
        choices: [],
        nextScene: "otryd6.5",  
    },
    
    "otryd6.5": {
        background: "",
        character: null,
        speaker: "",
        text: "На трудовой вечером встал вопрос о том, кто будет вставать на завтак. Тебе, конечно, совсем не хочется вставать раньше всех. Как поступишь?",
        choices: [
            {
                text: "Встать на завтрак",
                nextScene: "otryd6.6",
                effects: {
                    time: -1,
                    strength: -2,
                    respect: +2,
                    charisma: +1
                }
            },
            {
                text: "Не вставать",
                nextScene: "otryd6.6",
                effects: {
                    time: 0,
                    strength: +1,
                    respect: 0,
                    charisma: 0
                }
            }
        ],
    },
    "otryd6.6": {
        background: "",
        character: null,
        speaker: "",
        text: "Вы поехали полоть картошку. Работать предстоит по парам. К кому присоединьшься?",
        choices: [
            {
                text: "К новенькому",
                nextScene: "otryd6.7",
                effects: {
                    time: 0,
                    strength: -2,
                    respect: +1,
                    charisma: +3
                }
            },
            {
                text: "К товарищу",
                nextScene: "otryd6.7",
                effects: {
                    time: 0,
                    strength: -2,
                    respect: 0,
                    charisma: +1
                }
            }
        ],
    },
    "otryd6.7": {
        background: "",
        character: null,
        speaker: "",
        text: "Вечером второго дня снова встал вопрос про подъем на завтрак. Как поступишь?",
        choices: [
            {
                text: "Встать на завтрак",
                nextScene: "otryd7",
                effects: {
                    time: -1,
                    strength: -4,
                    respect: +2,
                    charisma: +1
                }
            },
            {
                text: "Не вставать",
                nextScene: "otryd7",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: 0
                }
            }
            
        ],
    },
    "otryd7": {
        background: "",
        character: null,
        speaker: "",
        text: "Ты узнал, что на следующий отряд не пойдет ни один из твоих друзей. Ты пойдешь?",
        choices: [
            {
                text: "Да",
                nextScene: "otryd7.1",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: +2,
                    charisma: 0
                }
            },
            {
                text: "Нет",
                nextScene: "otryd7.1",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -2,
                    charisma: 0
                }
            }
        ],
    },
    "otryd7.1": {
        background: "",
        character: null,
        speaker: "",
        text: "Наступил конец мая, у тебя начались экзамены в школе. В это же время подходит дедлайн: необходимо сдать кусочек мероприятия. Что будешь делать?",
        choices: [
            {
                text: "Сделаю и сдам не смотря ни на что",
                nextScene: "otryd7.2",
                effects: {
                    time: -2,
                    strength: -4,
                    respect: +2,
                    charisma: +1
                }
            },
            {
                text: "Не сделаю",
                nextScene: "otryd7.2",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -4,
                    charisma: 0
                }
            },
            {
                text: "Попрошу сделать кого-то в группе",
                nextScene: "otryd7.2",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: 0,
                    charisma: +1
                }
            },
            {
                text: "Попрошу перенести дату сдачи",
                nextScene: "otryd7.2",
                effects: {
                    time: -1,
                    strength: -1,
                    respect: +3,
                    charisma: -1
                }
            }
        ],
    },
    "otryd7.2": {
        background: "",
        character: null,
        speaker: "",
        text: "На последнем отряде новенький спросил тебя, считаешь ли ты себя стариком. Что ответишь?",
        choices: [
            {
                text: "Да,потому что",
                nextScene: "otryd7.3",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: +1,
                    charisma: +1
                },
            },
            {
                text: "Ну да",
                nextScene: "otryd7.3",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -2,
                    charisma: -2
                }
            }
        ],
    },
    "otryd7.3": {
        background: "",
        character: null,
        speaker: "Новенький",
        text: "А кем круче поехать на Сбор стариком или новеньким?",
        choices: [
            {
                text: "Стариком, конечно",
                nextScene: "sbor",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -1,
                    charisma: -1
                },
            },
            {
                text: "Новеньким, конечно",
                nextScene: "sbor",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: -1,
                    charisma: -1
                }
            },
            {
                text: "Другое",
                nextScene: "sbor",
                effects: {
                    time: 0,
                    strength: 0,
                    respect: +3,
                    charisma: +2
                },
            }
        ],
    },
    "sbor": {
        background: "",
        character: null,
        speaker: "",
        text: "Я возьму с собой на Сбор...",
        choices: [],
        nextScene: "sbor.1",
    },
    "sbor.1": {
        background: "",
        character: null,
        speaker: "",
        text: "Осталось всего пару дней до сбора. *звонок*",
        choices: [],
        nextScene: "sbor.2",
    },
    "sbor.2": {
        background: "",
        character: null,
        speaker: "Ответственный за отряд",
        text: "Ты едешь на Сбор?",
        choices: [
            {
                text: "Да",
                nextScene: "ending",
                effects: {
                    time: -5,
                    strength: 0,
                    respect: +6,
                    charisma: +2
                },
            },
            {
                text: "Нет",
                nextScene: "ploho",
                effects: {
                    time: +8,
                    strength: +2,
                    respect: -9,
                    charisma: -6
                }
            }
        ],
    },
    "ploho": {
        background: "",
        character: null,
        speaker: "",
        text: "В последний момент ты отказался ехать на Сбор, чем подвел отряд и группы по мероприятиям.",
        isEnding: true,
        endingTitle: "Конец: Обломщик",
        endingMessage: "Вы остались дома и упустили возможность провести незабываемое время в лагере. Лучше строить планы заранее."
    },
    "ending": {
        background: "assets/images/camp.jpg",
        character: null,
        speaker: "",
        text: "А там синева и небо, поле ромашек и целая жизнь взахлеб!",
        choices: [],
        isEnding: true,
        onEnter: function(game) {
            // Определяем концовку на основе статистики
            let respect = game.stats.respect;
            let charisma = game.stats.charisma;
            let strength = game.stats.strength;
            let time = game.stats.time;
            
            // Лучшая концовка - высокое уважение и харизма
            if (respect >= 15 && charisma >= 12) {
                game.endingTitle = "Конец: Легенда лагеря";
                game.endingMessage = "Твое мероприятие было просто невероятным! Все были в восторге, и тебя запомнят как самого творческого организатора. Вожатые намекнули, что в следующем году тебя ждет повышение до вожатого. Ты стал настоящей легендой Сбора!";
            } 
            // Хорошая концовка - хорошее уважение и харизма
            else if (respect >= 10 && charisma >= 8) {
                game.endingTitle = "Конец: Хороший организатор";
                game.endingMessage = "Мероприятие прошло хорошо. Были недочеты, но в целом все остались довольны. Ты заслужил уважение и новичков, и стариков. Хороший опыт на будущее!";
            }
            // Концовка с высокой силой, но низким уважением
            else if (strength >= 8 && respect < 8) {
                game.endingTitle = "Конец: Выносливый, но не командный игрок";
                game.endingMessage = "Ты отлично справлялся с физическими задачами, но не смог наладить отношения с командой. Твое мероприятие прошло средне, потому что ты делал всё в одиночку, не доверяя другим.";
            }
            // Концовка с хорошим тайм-менеджментом
            else if (time >= 8) {
                game.endingTitle = "Конец: Мастер тайм-менеджмента";
                game.endingMessage = "Ты отлично распределил свое время между подготовкой к Сбору и личными делами. Мероприятие прошло неплохо, хотя и без особых восторгов. Зато ты не выгорел и сохранил энергию для будущих проектов.";
            }
            // Средняя концовка
            else if (respect >= 5 && charisma >= 5) {
                game.endingTitle = "Конец: Обычный старик";
                game.endingMessage = "Твое мероприятие прошло нормально. Ничего особенного, но и провалом не назовешь. Ты стал частью команды стариков, и это главное.";
            }
            // Плохая концовка
            else {
                game.endingTitle = "Конец: Первый блин комом";
                game.endingMessage = "Твое мероприятие не вызвало особого энтузиазма. Но это ценный опыт, и в следующий раз ты обязательно учтешь ошибки. Главное - не сдаваться!";
            }
        }
    },
    "minigame_strength": {
        background: "assets/images/gym.jpg",
        character: null,
        speaker: "",
        text: "Тебе нужно подготовить реквизит для мероприятия. Это хорошая возможность потренировать силу!",
        choices: [
            {
                text: "Сыграть в мини-игру на силу",
                nextScene: "strength_game",
                effects: {
                    time: -1
                }
            },
            {
                text: "Пропустить и продолжить подготовку",
                nextScene: "next_scene",
                effects: {}
            }
        ]
    },
    "strength_game": {
        background: "assets/images/gym.jpg",
        character: null,
        speaker: "",
        text: "Нажимай на пробел как можно быстрее, чтобы поднять тяжелые коробки!",
        choices: [],
        onEnter: function(game) {
            // Запускаем мини-игру
            game.minigames.startStrengthMinigame();
        }
    },
    "minigame_charisma": {
        background: "assets/images/campfire.jpg",
        character: null,
        speaker: "",
        text: "Вечером у костра все рассказывают истории. Это отличная возможность проявить свою харизму!",
        choices: [
            {
                text: "Рассказать историю (мини-игра на харизму)",
                nextScene: "charisma_game",
                effects: {
                    time: -1
                }
            },
            {
                text: "Просто послушать других",
                nextScene: "next_scene",
                effects: {}
            }
        ]
    },
    "charisma_game": {
        background: "assets/images/campfire.jpg",
        character: null,
        speaker: "",
        text: "Выбери правильные слова, чтобы твоя история была интересной!",
        choices: [],
        onEnter: function(game) {
            // Запускаем мини-игру
            game.minigames.startCharismaMinigame();
        }
    }
};

// Добавьте массив случайных событий
export const randomEvents = [
    {
        text: "Во время подготовки к тебе подходит новичок и просит помощи.",
        choices: [
            {
                text: "Помочь новичку",
                effects: { time: -1, respect: +2, charisma: +1 }
            },
            {
                text: "Извиниться и продолжить свою работу",
                effects: { respect: -1 }
            }
        ]
    },
    {
        text: "Ты замечаешь, что кто-то забыл свой телефон. Рядом никого нет.",
        choices: [
            {
                text: "Отнести телефон вожатому",
                effects: { time: -1, respect: +2 }
            },
            {
                text: "Оставить на месте",
                effects: {}
            },
            {
                text: "Посмотреть, что в телефоне",
                effects: { respect: -2, charisma: -1 }
            }
        ]
    },
    {
        text: "Внезапно начинается дождь, а часть реквизита осталась на улице.",
        choices: [
            {
                text: "Быстро побежать спасать реквизит",
                effects: { strength: -1, respect: +2 }
            },
            {
                text: "Организовать группу для спасения реквизита",
                effects: { charisma: +2, time: -1 }
            }
        ]
    },
    {
        text: "Ты нашел интересную книгу по психологии общения. Потратить время на чтение?",
        choices: [
            {
                text: "Да, это поможет мне лучше понимать людей",
                effects: { time: -2, charisma: +3 }
            },
            {
                text: "Нет, сейчас нет времени на чтение",
                effects: {}
            }
        ]
    },
    {
        text: "Вожатый предлагает тебе помочь с организацией вечернего мероприятия.",
        choices: [
            {
                text: "С радостью помогу!",
                effects: { time: -2, respect: +3, strength: -1 }
            },
            {
                text: "Извини, я уже занят другими делами",
                effects: { respect: -1 }
            }
        ]
    },
    {
        text: "Ты заметил, что некоторые новички держатся в стороне от общих активностей.",
        choices: [
            {
                text: "Подойти и вовлечь их в общение",
                effects: { charisma: +2, respect: +2 }
            },
            {
                text: "Сообщить об этом вожатому",
                effects: { respect: +1 }
            },
            {
                text: "Не вмешиваться",
                effects: {}
            }
        ]
    },
    {
        text: "Ты нашел старую фотографию прошлогоднего Сбора. Нахлынули воспоминания.",
        choices: [
            {
                text: "Показать фотографию другим старикам",
                effects: { time: -1, charisma: +1, respect: +1 }
            },
            {
                text: "Оставить себе на память",
                effects: { charisma: +1 }
            }
        ]
    },
    {
        text: "Один из новичков выглядит растерянным и не знает, чем заняться.",
        choices: [
            {
                text: "Предложить ему помощь и рассказать о лагере",
                effects: { time: -2, respect: +2, charisma: +1 }
            },
            {
                text: "Познакомить его с другими новичками",
                effects: { time: -1, respect: +1 }
            },
            {
                text: "Пусть сам разбирается, у тебя много дел",
                effects: {}
            }
        ]
    },
    {
        text: "Вожатый просит помочь с переносом тяжелого оборудования для вечернего мероприятия.",
        choices: [
            {
                text: "Конечно, я помогу!",
                effects: { strength: +2, time: -1, respect: +1 }
            },
            {
                text: "Предложить организовать группу для помощи",
                effects: { charisma: +1, respect: +1, time: -1 }
            },
            {
                text: "Извиниться, сославшись на другие обязанности",
                effects: { respect: -1 }
            }
        ]
    },
    {
        text: "Ты случайно услышал, как группа новичков обсуждает, что им скучно.",
        choices: [
            {
                text: "Предложить им интересную игру",
                effects: { charisma: +2, respect: +2, time: -2 }
            },
            {
                text: "Рассказать об этом вожатому",
                effects: { respect: +1, time: -1 }
            },
            {
                text: "Не вмешиваться",
                effects: {}
            }
        ]
    },
    {
        text: "Во время обеда ты заметил, что кто-то оставил поднос с едой на столе.",
        choices: [
            {
                text: "Убрать поднос самому",
                effects: { respect: +1, strength: -1 }
            },
            {
                text: "Найти владельца подноса",
                effects: { time: -1, respect: +1 }
            },
            {
                text: "Оставить как есть",
                effects: {}
            }
        ]
    },
    {
        text: "Ты нашел интересную настольную игру в игровой комнате.",
        choices: [
            {
                text: "Организовать игровой вечер",
                effects: { charisma: +2, respect: +2, time: -2 }
            },
            {
                text: "Поиграть с несколькими друзьями",
                effects: { charisma: +1, time: -1 }
            },
            {
                text: "Отложить на потом",
                effects: {}
            }
        ]
    }
];

// Добавьте функцию для генерации случайного события
export function getRandomEvent() {
    return randomEvents[Math.floor(Math.random() * randomEvents.length)];
} 