var pFactor, pFactorButton;
var iFactor, iFactorButton;


function sendFactors() {
    sendCommandRequest('/factors', {
        p: pFactor.prop('value'),
        i: iFactor.prop('value')
    });
}


$(document).ready(function() {
    pFactor = $('#p_factor');
    pFactorButton = $('#p_factor_button');
    iFactor = $('#i_factor');
    iFactorButton = $('#i_factor_button');

    pFactorButton.on('click', sendFactors);
    iFactorButton.on('click', sendFactors);
});