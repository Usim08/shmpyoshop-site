const mongoose = require('mongoose');


const partner_yang = new mongoose.Schema({
    serverName: { type: String, required: true },
    managerId: { type: String, required: true },
    webCode: { type: String, required: true },
    channelId: { type: String, required: true }
});

const WebsiteVerify = mongoose.model('partner_yang', partner_yang, 'partner_yang');
module.exports = WebsiteVerify;
