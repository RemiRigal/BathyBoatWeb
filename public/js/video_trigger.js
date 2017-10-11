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
    videoDiv = $('#video');
    videoDiv.hide();
    videoDiv.on('click', triggerVideo);
    videoButton = $('#video_button');
    videoButton.on('click', triggerVideo);
});