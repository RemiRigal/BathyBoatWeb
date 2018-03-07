var pFactor, piFactorButton, iFactor;


function sendFactors() {
    sendCommandRequest('/factors', {
        p: pFactor.prop('value'),
        i: iFactor.prop('value')
    });
}


$(document).ready(function() {
    pFactor = $('#p_factor');
    iFactor = $('#i_factor');
    piFactorButton = $('#pi_factor_button');

    piFactorButton.on('click', sendFactors);
});