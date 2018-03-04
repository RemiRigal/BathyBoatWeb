var videoEnabled = false;
var videoDiv, videoButton;

function triggerVideo() {
    if (videoEnabled) {
        videoDiv.hide();
        videoButton.show();
        videoEnabled = false;
    } else {
        videoButton.hide();
        videoDiv.show();
        videoEnabled = true;
    }
    $.ajax({
        type: 'POST',
        url: 'http://' + document.location.hostname + ':29201/video',
        data: {action: videoEnabled ? 'enable' : 'disable', time: new Date()}
    });
}

function getVideoStatus() {
    $.ajax({
        type: 'GET',
        url: 'http://' + document.location.hostname + ':29201/video',
        success: function(boolResult) {
            videoEnabled = boolResult;
            if (videoEnabled) {
                videoButton.hide();
                videoDiv.show();
            }
        }
    });
}

$(document).ready(function() {
    videoDiv = $('#video');
    videoButton = $('#video_button');

    videoDiv.hide();
    videoButton.show();
    videoDiv.on('click', triggerVideo);
    videoButton.on('click', triggerVideo);

    getVideoStatus();

    var canvas = document.getElementById('video-canvas');
    var url = 'ws://' + document.location.hostname + ':8082/';
    new JSMpeg.Player(url, {canvas: canvas});
});