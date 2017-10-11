
function chooseFile(name) {
    var chooser = $(name);
    chooser.unbind('change');
    chooser.change(function(evt) {
        console.log($(this).val());
    });

    chooser.trigger('click');
}

function showDialogImport() {
    console.log("import");
    chooseFile('#importDialog');
}

function showDialogExport() {
    console.log("export");
    chooseFile('#exportDialog');
}



$(document).ready(function() {
    exportButton = $('#export_mission_button');
    exportButton.on('click', showDialogExport);
    importButton = $('#import_mission_button');
    importButton.on('click', showDialogImport);
});