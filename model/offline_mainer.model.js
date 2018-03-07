const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OfflineMainersSchema = new Schema({
    numberMainer: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
   
});

mongoose.model('offmainers',OfflineMainersSchema); //поменять ИМЯ модель