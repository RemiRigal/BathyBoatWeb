var videoEnabled = false;

function triggerVideo() {
    videoEnabled = !videoEnabled;
    console.log('Enable video: ' + videoEnabled);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:29201/video',
        data: {action: videoEnabled ? 'enable' : 'disable'},
        error: function(error) {
            console.log(error);
        }
    });
}

$(document).ready(function() {
    $('#stop_button').on('click', triggerVideo);
});