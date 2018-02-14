var blueviewImage;


function refreshBlueview() {
    blueviewImage.attr('src', 'images/blueview/img.png?' + new Date().getTime());
}


$(document).ready(function() {
    blueviewImage = $('#blueview_image');
    setInterval(refreshBlueview, 1000);
});