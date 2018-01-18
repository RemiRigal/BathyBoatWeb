exports.getLastData = function(array, date) {
    if (array.length === 0) {
        return [];
    }
    var last = [];
    var i = 0;
    while (i < array.length && date < array[array.length - 1 - i].date) {
        last.push(array[array.length - 1 - i]);
        i++;
    }
    return last;
};