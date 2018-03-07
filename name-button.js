const emoji = require('node-emoji').emoji;

module.exports = {
    start_screen: {
        stop: emoji.no_bell+' Отключить оповещение'
    },
    stop_screen: {
        start: emoji.bell+' Включить оповещение'
    },
    statistic: emoji.bar_chart+' Статистика',
    statistics: {
        day: 'За день',
        week: 'За неделю',
        all_time: 'Все время',
        period: 'Выбрать период',
        select_period_day: 'sd',
        select_period: 'sp'
    },
    back: emoji.arrow_left+' Назад',
};