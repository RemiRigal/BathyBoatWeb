var sessionStart = 0;
var sessionDistance = 0;
var sessionProgress = 0;

function startSession() {
    sessionStart = new Date();
}

function updateSession() {
    var duration = new Date(new Date() - sessionStart);
    $('#session_time').html(duration.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[1]);

    // TODO: Update distance and progress
}