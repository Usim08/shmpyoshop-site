const mongoose = require('mongoose');


const ts = new mongoose.Schema({
    userName: { type: String, required: true },
    channelId: { type: String, required: true },
    managerId: { type: String, required: true }
});

const trash_data = mongoose.model('trash_data', ts, 'trash_data');
module.exports = trash_data;
