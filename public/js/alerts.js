var alerts = [];

function addAlert(alert) {
    alert.id = alerts.length;
    alerts.push(alert);
    var htmlAlert = '<div class="alert alert-dismissible alert-warning"><button type="button" id="alert_'+ alert.id +
    '" class="close" data-dismiss="alert">&times;</button>' +
    '<strong>' + alert.title + ': </strong>' + alert.body + '</div>';
    $('#alert_container').html($('#alert_container').html() + htmlAlert);
}

$(document).ready(function () {

});