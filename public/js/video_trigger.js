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
    console.log('Video state: ' + videoEnabled);

    // $.ajax({
    //     type: 'POST',
    //     url: 'http://' + document.location.hostname + ':29201/video',
    //     data: {action: videoEnabled ? 'enable' : 'disable', time: new Date()},
    //     error: function(error) {
    //         console.log(error);
    //     }
    // });
}

$(document).ready(function() {
    videoDiv = $('#video');
    videoButton = $('#video_button');
    videoDiv.show();
    videoButton.hide();

    //videoDiv.hide();
    //videoButton.show();
    //videoDiv.on('click', triggerVideo);
    //videoButton.on('click', triggerVideo);

    var canvas = document.getElementById('video-canvas');
    var url = 'ws://' + document.location.hostname + ':8082/';
    var player = new JSMpeg.Player(url, {canvas: canvas});
});