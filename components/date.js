module.exports = {
    parseDate(date1) { // выводит дату 05.03.2018

        let date = new Date(date1);
        let curr_date = date.setDate(date.getDate());
        let curr_month = date.getMonth()+1 ;
        let curr_year = date.getFullYear();

        return `${this.addZero(date.getDate())}.${this.addZero(curr_month)}.${curr_year}`;
    },
    addZero(dateNumber) {
        if (dateNumber < 10) {
            return '0' + dateNumber;
        }
        return dateNumber;
    },
    getDate(days, date=false) { // выводит нужный день отталкиваяся от сегодняшнего
        let date1;
        if(date){
             date1 = new Date(date);
        }else{
             date1 = new Date();
        }
        let curr_date = date1.setDate(date1.getDate() + days);
        let curr_month = date1.getMonth() + 1;
        let curr_year = date1.getFullYear();
        return `${curr_year}-${this.addZero(curr_month)}-${this.addZero(date1.getDate()) }`;
    },
    getNowDate() {
        let now = new Date();
        now.setHours(now.getHours() + (now.getTimezoneOffset()/60) + 6);
        return now;
    },
    todayParse() {
        return this.parseDate(new Date(this.getDate(0)))
    },
    tomorrowParse() {
        return this.parseDate(new Date(this.getDate(1)))
    },
    oneWeekAgoParse() {
        return this.parseDate(new Date(this.getDate(-7)))
    },
    today() {
        return new Date(this.getDate(0));
    },
    tomorrow() {
        return new Date(this.getDate(1));
    },
    oneWeekAgo() {
        return new Date(this.getDate(-7));
    }
};
