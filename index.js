const rp = require('request-promise');
const lodash = require('lodash');
const fs = require('fs');
const mongoose = require('mongoose');
const helper = require('./helper');
const dateComp = require('./components/date');
const config = require('./config');
const button = require('./name-button'); // названия кнопок


const screen = require('./screen'); //


const emoji = require('node-emoji').emoji;

//https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json

let arrayUsers = [];
let arrayMainer = [];
////////////// бд   ////////////////////
mongoose.Promise = global.Promise;
mongoose.connect(config.DB_URL)
    .then(() => console.log(' mongoosse connect'))
    .catch(err => console.log(err, ' Ошибка '));

require('./model/offline_mainer.model.js');
const query = require('./model/query.offline_mainer.js');

const OfflineMainersSchema = mongoose.model('offmainers');

/*new OfflineMainersSchema({
 numberMainer: 5}).save().then(console.log('Ноовая запись в юзеры')).catch(console.log(' Ошибка  записи юзера'));*/
/*Film.find({}).remove().then(()=> console.log(' УДАЛЕНО !!!!'))
 .catch(err=> console.log(err, ' Ошибка не удалено'));*/
///////////////////////////////////////////


const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.TOKEN, {polling: true});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    let sendMessage;
    switch (msg.text) {
        case button.start_screen.stop: // кнопка СТОП

            deleteUsersOfSendMessage(chatId); // удалить пользователя

            bot.sendMessage(chatId, 'Вы больше не будете получать сообщений по работе ригов', screen.stop);
            break;
        case button.stop_screen.start: // кнопка СТАРТ

            addUsersOfSendMessage(chatId); // добавить нового пользователя
            let ArrayOffMainers1 = getOffMainers(arrayOffline);
            bot.sendMessage(chatId, 'Вы подписались на оповещения по работе ригов', screen.start);
            sendMessageUser(chatId, ArrayOffMainers1);

            break;
        case button.statistic: // кнопка СТАТИСТИКА

            bot.sendMessage(chatId, 'Выберите интересующую статистику: ', screen.statistic);
            break;
        /* статистика*/
        case button.statistics.day: // кнопка "За ДЕНЬ"

            sendMessage = {
                bot: bot,
                chatId: chatId,
                text: `<i>Статистика за сегодня:</i> \n<b>(${dateComp.todayParse()})</b>\n\n`,
                screen: screen.statistic
            };

            query.getCountOfflineMainersThePeriod(sendMessage, dateComp.today(), dateComp.tomorrow());

            break;
        case button.statistics.week: // кнопка "За НЕДЕЛЮ"

            sendMessage = {
                bot: bot,
                chatId: chatId,
                text: `<i>Статистика за неделю:</i> \n<b>с ${dateComp.oneWeekAgoParse()} по ${dateComp.todayParse()}</b>\n\n`,
                screen: screen.statistic
            };
            query.getCountOfflineMainersThePeriod(sendMessage, dateComp.oneWeekAgo(), dateComp.tomorrow());

            break;
        case button.statistics.all_time: // кнопка "За все время"
            sendMessage = {
                bot: bot,
                chatId: chatId,
                text: `<i>Статистика за все время:</i> \n\n`,
                screen: screen.statistic
            };
            query.getCountOfflineMainersThePeriod(sendMessage);
            break;
        case button.statistics.period: // кнопка "За все время"
            let text = `<i>Укажите произвольный период:</i> \n\n${emoji.white_check_mark} Для получения статистики <i>за конкретный день</i> отправьте команду:  \n<code>\/${button.statistics.select_period_day} дд.мм.гггг</code> \n\n<b>Пример: \/${button.statistics.select_period_day} 07.03.2018</b> \n\n${emoji.white_check_mark} Cтатистика за <i>определенный период</i> отправьте команду: \n<code>\/${button.statistics.select_period} дд.мм.гггг-дд.мм.гггг</code> \n\n<b>Пример: \/${button.statistics.select_period} 01.03.2018-07.03.2018</b>\n\n`;

            bot.sendMessage(chatId, text, screen.statistic);
            break;

        case button.back: // кнопка НАЗАД
            let screenStatus;
            (arrayUsers.indexOf(chatId) < 0) ? screenStatus = screen.stop : screenStatus = screen.start;
            bot.sendMessage(chatId, 'Выберите интересующий пункт:', screenStatus);
            break;
    }

});

bot.onText(/\/start/, msg => {

    const chatId = msg.chat.id;

    addUsersOfSendMessage(chatId);

    let ArrayOffMainers1 = getOffMainers(arrayOffline);
    bot.sendMessage(chatId, 'Вы подписались на оповещения по работе ригов', screen.start);
    sendMessageUser(chatId, ArrayOffMainers1);
});
bot.onText(/\/sd (.+)/, (msg, [sourse, match]) => {
    const chatId = msg.chat.id;
    let dateArray = match.split('.');

    let requestedDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    let requestedNextDate = dateComp.getDate(1, requestedDate);
    /*console.log(requestedNextDate)*/
    sendMessage = {
        bot: bot,
        chatId: chatId,
        text: `<i>Статистика за день:</i> \n<b>(${dateComp.parseDate(requestedDate)})</b>\n\n`,
        screen: screen.statistic
    };

    query.getCountOfflineMainersThePeriod(sendMessage, new Date(requestedDate), new Date(requestedNextDate));

});
bot.onText(/\/sp (.+)/, (msg, [sourse, match]) => {
    const chatId = msg.chat.id;

    let arrayTwoDate = match.split('-');
  /*  console.log('arrayTwoDate', arrayTwoDate);*/

    let arrayDate1 = arrayTwoDate[0].split('.');
    let arrayDate2 = arrayTwoDate[1].split('.');
    let date1 = `${arrayDate1[2]}-${arrayDate1[1]}-${arrayDate1[0]}`;
    let date2 = `${arrayDate2[2]}-${arrayDate2[1]}-${arrayDate2[0]}`;
   /* console.log('date1', date1);
    console.log('date2', date2);*/

    sendMessage = {
        bot: bot,
        chatId: chatId,
        text: `<i>Статистика за период:</i> \n<b>с ${dateComp.parseDate(date1)} по ${dateComp.parseDate(date2)}</b>\n\n`,
        screen: screen.statistic
    };

    query.getCountOfflineMainersThePeriod(sendMessage, new Date(date1), new Date(dateComp.getDate(1, date2)));

});


let arraySend;
let arrayOffline = [];
(coincidenceArrays() != false) ? arraySend = coincidenceArrays() : arraySend = [];


function getHashreate(name, ip_port) {
    let number = (name - 1);
    return rp('http://' + ip_port)
        .then(function () {

            if (arrayOffline[number] == undefined || arrayOffline[number] == 1) {
                arrayOffline[number] = 0
            }

        })
        .catch(function (err) {

            if (arrayOffline[number] == undefined || arrayOffline[number] == 0) {
                arrayOffline[number] = 1
                query.addOfflineMainer(name)
                if (config.SHOW_LOG) {
                    console.log('отправляю данные в mongo', name)
                }
            }

        });

}

function checkConnectionMainers() {

    getHashreate(1, '192.168.0.101:3333');
    getHashreate(2, '192.168.0.102:3333');
    getHashreate(3, '192.168.0.103:3333');
    getHashreate(4, '192.168.0.104:3333');
    getHashreate(5, '192.168.0.105:3333');
    getHashreate(6, '192.168.0.106:3333');
    getHashreate(7, '192.168.0.107:3333');
    getHashreate(8, '192.168.0.108:3333');
    getHashreate(9, '192.168.0.109:3333');
    getHashreate(10, '192.168.0.110:3333');
    getHashreate(11, '192.168.0.111:3333');
    getHashreate(12, '192.168.0.112:3333');
    getHashreate(13, '192.168.0.113:3333');
    getHashreate(14, '192.168.0.114:3333');
    getHashreate(15, '192.168.0.115:3333');
    getHashreate(16, '192.168.0.116:3333');
    getHashreate(17, '192.168.0.117:3333');
    getHashreate(18, '192.168.0.118:3333');
    getHashreate(19, '192.168.0.119:3333');
    getHashreate(20, '192.168.0.120:3333');
    getHashreate(21, '192.168.0.121:3333');
    getHashreate(22, '192.168.0.122:3333');
    getHashreate(23, '192.168.0.123:3333');
    getHashreate(24, '192.168.0.124:3333');
    getHashreate(25, '192.168.0.125:3333');

    coincidenceArrays(arraySend, arrayOffline)
}


function coincidenceArrays() {

    if (arrayOffline > arraySend || arrayOffline < arraySend) {
        if (config.SHOW_LOG) {
            console.log('\nНЕ ОДИНАКОВЫЕ');
            console.log('arraySend', arraySend);
            console.log('arrayOffline', arrayOffline);
        }
        let ArrayOffMainers = getOffMainers(arrayOffline);
        if (config.SHOW_LOG) {
            console.log('getOffMainers()', ArrayOffMainers);
        }
        sendMessageAllUsers(ArrayOffMainers);
        return arraySend = arrayOffline.slice();

    } else {
        if (config.SHOW_LOG) {
            console.log('\nмассивы одинаковые ');
            console.log('arraySend', arraySend);
            console.log('arrayOffline', arrayOffline);
        }
        return false;
    }


}

function getOffMainers(arrayOffline) {
    let arr = [];
    arrayOffline.forEach(function (element, index) {
        if (element == 1) {
            arr.push(index + 1);
        }
    });

    return arr;
}

function sendMessageUser(user, arrayLast) {
    let text;
    if (arrayLast.length == 0) {
        text = emoji.thumbsup + ` Pаботают все риги: ${config.ALL_COUNT_MINER }`;
    } else {
        text = emoji.thumbsdown + '<b> Внимание!</b> ' + `\nВсего работает ригов: ${config.ALL_COUNT_MINER - arrayLast.length} \nНе работает ${arrayLast.length}: - ${arrayLast.toString()}`;
    }


    bot.sendMessage(user, text, {parse_mode: 'HTML'});
    if (config.SHOW_LOG) {
        console.log(text);
    }
}

/* Удаление нового пользователя от показа Сообщений */
function deleteUsersOfSendMessage(chatId) {
    let number = arrayUsers.indexOf(chatId);
    if (number > -1) {
        arrayUsers.splice(number, 1); // добавление нового пользователя для показа сообщений
    }
    if (config.SHOW_LOG) {
        console.log(' массив юзеров которые подписаны на сообщения ', arrayUsers);
        console.log(' колличество юзеров', number);
        console.log(' удалился ', chatId);
    }
}

/* добавление нового пользователя для показа Сообщений */
function addUsersOfSendMessage(chatId) {
    if (arrayUsers.indexOf(chatId) < 0) {
        arrayUsers.push(chatId); // добавление нового пользователя для показа сообщений
    }
    if (config.SHOW_LOG) {
        console.log(' массив юзеров которые подписаны на сообщения ', arrayUsers);
        console.log(' добавился ', chatId);
    }
}

/* отправить сообщение всем пользователям которые читают */
function sendMessageAllUsers(arrayLast) {
    if (arrayUsers.length > 0) {
        for (let user of arrayUsers) {
            sendMessageUser(user, arrayLast)
        }
    }

}


setInterval(checkConnectionMainers, config.INTERVAL_REPEAT);








