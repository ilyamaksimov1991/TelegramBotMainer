require('./offline_mainer.model.js');
const dateComp = require('../components/date');
const mongoose = require('mongoose');
const config = require('../config');

const OfflineMainersSchema = mongoose.model('offmainers');

module.exports = {
    getCountOfflineMainersThePeriod(sendMessage, date1 = false, date2 = false) {

        let aggregate = [];
        let count = 0;

        let match = {$match: {date: {$gte: new Date(date1), $lt: new Date(date2)}}};
        let group = {$group: {_id: {numberMainer: "$numberMainer"}, count: {$sum: 1}}};
        let sort = {$sort: {"_id.numberMainer": 1}};

        if (date1 && date2) {
            aggregate.push(match);
        }
        aggregate.push(group);
        aggregate.push(sort);

        OfflineMainersSchema.aggregate(aggregate, function (err, mainers) {
            if (err) {
                console.log('ОШИБКА  ЗАПРОСА');
            }

            let html = mainers.map((mainer, i) => {

                return '<b>Риг: ' + mainer._id.numberMainer + '</b> —   отключений: ' + mainer.count;
            }).join('\n');


            mainers.map((mainer, i) => {return count += Number(mainer.count);});

            if (html.length === 0) {html = ' Нет данных';}

            sendMessage.bot.sendMessage(sendMessage.chatId, sendMessage.text + html + '\n\n<i>Всего отключений</i>: '+count, sendMessage.screen);
            if (config.SHOW_LOG) {
                console.log(sendMessage.text, html);
                console.log('count', count)
            }

        });
    },
    addOfflineMainer(number) {

        new OfflineMainersSchema({
            numberMainer: number,
            date: dateComp.getNowDate()
        })
            .save()
            .then(thenAdd())
            .catch(catchAdd());
    }

};
function thenAdd() {
    if (config.SHOW_LOG) {
        console.log('Ноовая запись в юзеры')
    }
}
function catchAdd() {
    if (config.SHOW_LOG) {
        console.log(' Ошибка  записи юзера')
    }
}