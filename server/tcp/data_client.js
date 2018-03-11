var tcpClient = require('./tcp_client');


var states = ['Idle', 'Running', 'Pause', 'RTL', 'Emergency'];

module.exports = function() {
    dataTCP = new tcpClient('Data', config.web.webServer.rosIP, config.common.tcp.dataPort, onDataReceived);
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
        case '$STATE':
            if (currentState !== data.content.state) {
                currentState = data.content.state;
                globalData.state.push(data);
                console.log('State:', states[currentState]);
            }
    }
    if (globalData.pos.length > 50) {
        globalData.pos = globalData.pos.slice(globalData.pos.length - 50, globalData.pos.length - 1);
    }
    if (globalData.batt.length > 50) {
        globalData.batt = globalData.batt.slice(globalData.batt.length - 50, globalData.batt.length - 1);
    }
    if (globalData.mot.length > 50) {
        globalData.mot = globalData.mot.slice(globalData.mot.length - 50, globalData.mot.length - 1);
    }
    if (globalData.data.length > 50) {
        globalData.data = globalData.data.slice(globalData.data.length - 50, globalData.data.length - 1);
    }
    if (globalData.state.length > 50) {
        globalData.state = globalData.state.slice(globalData.state.length - 50, globalData.state.length - 1);
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
        msg.content.lng = splitted[3];
        msg.content.yaw = (360 * (splitted[4] / (2 * Math.PI)) + 360)%360;
        msg.content.speed = splitted[5];
        msg.content.signal = splitted[6];
    } else if (msg.type === '$DATA') {
        msg.content.hydro1 = splitted[2];
        msg.content.hydro2 = splitted[3];
    } else if (msg.type === '$BATT') {
        msg.content.b1 = splitted[2] * 100;
        msg.content.b2 = splitted[3] * 100;
    } else if (msg.type === '$MOT') {
        msg.content.m1 = (splitted[2] - 4000) / 40;
        msg.content.m2 = (splitted[3] - 4000) / 40;
        msg.content.fidelity = splitted[4];
    } else if (msg.type === '$STATE') {
        msg.content.state = parseInt(splitted[2]);
        msg.content.stateText = states[parseInt(splitted[2])];
        msg.content.speedFactor = splitted[3];
        msg.content.pFactor = splitted[4];
        msg.content.iFactor = splitted[5];
        msg.content.dFactor = splitted[6];
    } else {
        return null;
    }
    return msg;
}
