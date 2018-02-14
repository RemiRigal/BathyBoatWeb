var blueviewImage;


function refreshBlueview() {
    blueviewImage.attr('src', 'http://' + document.location.hostname + ':29201/images/blueview/imgn.png?' + new Date().getTime());
}


$(document).ready(function() {
    blueviewImage = $('#blueview_image');
    setInterval(refreshBlueview, 1000);
});