const button = require('./name-button');
module.exports = {
    start: {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [
                [button.statistic],
                [button.start_screen.stop]
            ]
        }
    },
    stop: {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [
                [button.stop_screen.start],
                [button.statistic]
            ]
        }
    },
    statistic: {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [
                [button.statistics.day,button.statistics.week, button.statistics.all_time,button.statistics.period],
                [button.back]
            ]
        }
    },
};

/*
 {
 reply_markup: {
 keyboard: keyboard.stop_screen
 }
 }*/
