var tcpClient = require('./tcp_client');


var client;

module.exports = function() {
    client = tcpClient('Command', rosIP, 29200, onDataReceived);
};

function onDataReceived(msg) {
    var data = splitData(msg);
    switch (data.type) {
        case '$POS':
            globalData.pos.push(data);
            break;
        case '$BATT':
            globalData.batt.push(data);
            break;
        case '$MOT':
            globalData.mot.push(data);
            break;
        case '$DATA':
            globalData.data.push(data);
            break;
    }
}

function splitData(raw) {
    var splitted = raw.split(';');
    if (splitted.length < 2) {
        return null;
    }
    var msg = {
        type: splitted[0],
        date: splitted[1],
        content: {}
    };
    if (msg.type === '$POS') {
        msg.content.lat = splitted[2];
        msg.content.long = splitted[3];
        msg.content.yaw = splitted[4];
        msg.content.pitch = splitted[5];
        msg.content.roll = splitted[6];
        msg.content.speed = splitted[7];
        msg.content.signal = splitted[8];
    } else if (msg.type === '$DATA') {
        msg.content.temp = splitted[2];
        msg.content.hydro1 = splitted[3];
        msg.content.hydro2 = splitted[4];
    } else if (msg.type === '$BATT') {
        msg.content.m1 = splitted[2];
        msg.content.m2 = splitted[3];
        msg.content.elec = splitted[4];
    } else if (msg.type === '$MOT') {
            msg.content.m1 = splitted[2];
            msg.content.m2 = splitted[3];
            msg.content.fidelity = splitted[4];
    } else {
        return null;
    }
    return msg;
}
