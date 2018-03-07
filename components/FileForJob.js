function getHashreate(name, ip_port) {

    return rp('http://' + ip_port)
        .then(function (htmlString) {
            /*let nun_concurrency = htmlString.indexOf('ETH - Total Speed:');
             let hashreat = htmlString.slice(nun_concurrency + 19, nun_concurrency + 19 + 3);*/

            if (arrayMainer[name] == undefined || arrayMainer[name] == 1) {
                arrayMainer[name] = 0
                /* } else if (arrayMainer[name] == 1) {
                     arrayMainer[name] = 0*/
            }
        })
        .catch(function (err) {
            fs.appendFileSync('file.txt', name + ',');
            if (arrayMainer[name] == undefined || arrayMainer[name] == 0) {
                arrayMainer[name] = 1
                query.addOfflineMainer(name);
                console.log(' Отправляю сообщение в moongodb об отказе', name)
                /*  } else if (arrayMainer[name] == 0) {
                      arrayMainer[name] = 1
                      query.addOfflineMainer(name);
                      console.log(' Отправляю сообщение в moongodb об отказе', name)*/
            }
        });

}

function connectionMainers() {

    getHashreate(1, '192.168.0.101:3333');
    getHashreate(2, '199.168.0.102:3333');
    getHashreate(3, '192.168.0.103:3333');
    getHashreate(4, '192.168.0.104:3333');
    getHashreate(5, '192.168.0.105:3333');
    getHashreate(6, '192.168.0.106:3333');
    getHashreate(7, '192.168.0.107:3333');
    getHashreate(8, '192.168.0.108:3333');
    getHashreate(9, '192.168.0.109:3333');
    getHashreate(10, '192.168.0.110:3333');
    getHashreate(11, '199.168.0.111:3333');
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

    fs.appendFileSync('file.txt', '\n' + config.STRING_NEW_LINE);
    coincidenceTwoArrays()
}


/* проверка на совпадение 2х массивов arrayPenultimate, arrayLast*/
function coincidenceTwoArrays() {
    let lastAndPenultimateString = getLastAndPenultimateString();
    let arrayPenultimate = convertingStringToArray(lastAndPenultimateString[0]); // массив предпоследняя строка
    let arrayLast = convertingStringToArray(lastAndPenultimateString[1]); // массив  последняя строка

    let countCoincidence = countCoincidenceTwoArray(arrayPenultimate, arrayLast); // колличество отличий в 2-х массивах

    if (countCoincidence != config.EQUAL) { //массивы не одинаковые
        sendMessageAllUsers(arrayLast);
        console.log('no');
        console.log('последняя строка', arrayLast.toString());
        console.log('предпоследняя строка', arrayPenultimate.toString());

    } else {
        console.log('массивы одинаковые');
        console.log('последняя строка', arrayLast.toString());
        console.log('предпоследняя строка', arrayPenultimate.toString());
    }
}

/* колличество отличий в 2-х массивах */
function countCoincidenceTwoArray(arrayPenultimate, arrayLast) {
    let array1;
    let array2;
    (arrayPenultimate.length > arrayLast.length) ? (array1 = arrayPenultimate, array2 = arrayLast) : (array2 = arrayPenultimate, array1 = arrayLast);

    let countCoincidence = lodash.difference(array1, array2);

    return countCoincidence
}

/* предпоследняя и последняя строка из файла */
function getLastAndPenultimateString() {
    let arrayString = [];

    let data = fs.readFileSync('file.txt', 'utf8');
    let array = data.toString().split("\n");

    arrayString.push(array[array.length - 3]);// предпоследняя строка
    arrayString.push(array[array.length - 2]);// последняя строка

    return arrayString;
}

/* из строки делает массив*/
function convertingStringToArray(string = '') {
    let lengthStringNewLine = config.STRING_NEW_LINE.length; // колличество символов в строке обозначающее новую строку
    let stringErrorRig = string.slice(lengthStringNewLine);
    let array = stringErrorRig.split(",");
    array.pop(); // удаляет последний элемент из массива
    return array;
}

/* Удаление нового пользователя от показа Сообщений */
function deleteUsersOfSendMessage(chatId) {
    let number = arrayUsers.indexOf(chatId);
    if (number > -1) {
        arrayUsers.splice(number, 1); // добавление нового пользователя для показа сообщений
    }

    console.log(' массив юзеров которые подписаны на сообщения ', arrayUsers);
    console.log(' колличество юзеров', number);
    console.log(' удалился ', chatId);
}

/* добавление нового пользователя для показа Сообщений */
function addUsersOfSendMessage(chatId) {
    if (arrayUsers.indexOf(chatId) < 0) {
        arrayUsers.push(chatId); // добавление нового пользователя для показа сообщений
    }

    console.log(' массив юзеров которые подписаны на сообщения ', arrayUsers);
    console.log(' добавился ', chatId);
}

/* отправить сообщение всем пользователям которые читают */
function sendMessageAllUsers(arrayLast) {
    if (arrayUsers.length > 0) {
        for (let user of arrayUsers) {
            sendMessageUser(user, arrayLast)
        }
    }

}


/* отправить сообщение всем пользователям которые читают */
function sendMessageUser(user, arrayLast) {
    let text = `Всего работает ригов: ${config.ALL_COUNT_MINER - arrayLast.length} \nНе работает ${arrayLast.length}: - ${arrayLast.toString()}`;
    bot.sendMessage(user, text);
    console.log(text);
}

/*
let d1 =new Date(dateComp.getDate(new Date(), 0));
let d2 = new Date(dateComp.getDate(new Date(), 1));
///////////---------------------------------------------
OfflineMainersSchema.aggregate([

    {$match: {date: {$gte: new Date(d1), $lt: new Date(d2)}}},
    {
        $group: {
            _id: {numberMainer: "$numberMainer"},
            count: {
                $sum: 1
            }

        }
    },
    {$sort: {"_id.numberMainer": 1}}
], function (err, data) {
    /!*console.log(data);*!/

    let html = data.map((f, i) => {
        // console.log('Майнер-',f._id.numberMainer,' количество', f.count);
        return 'Майнер-' + f._id.numberMainer + ' количество-' + f.count;

    }).join('\n');
     html += `\n с ${dateComp.parseDate(d1)} - по ${dateComp.parseDate(d2)}`
    console.log(html)
    /!*console.log(data)*!/
});
*/

/*let d1 = new Date(dateComp.getDate(new Date(), 0));
let d2 = new Date(dateComp.getDate(new Date(), 1));
query.getCountOfflineMainersThePeriod(d1,d2);*/


setInterval(connectionMainers, config.INTERVAL_REPEAT);
