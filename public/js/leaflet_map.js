var globalMap, miniMap;


$(document).ready(function() {
    globalMap = L.map('gloablMap').setView([48.199040, -3.015805], 17);
    miniMap = L.map('miniMap').setView([48.199040, -3.015805], 17);

    L.tileLayer('http://localhost:29201/images/maps/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 13
    }).addTo(globalMap);
    L.tileLayer('http://localhost:29201/images/maps/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 13
    }).addTo(miniMap);

    L.polygon([
        [48.199040, -3.016405],
        [48.200040, -3.016905],
        [48.200040, -3.014805],
        [48.199040, -3.014605]
    ]).addTo(globalMap);
    L.polygon([
        [48.199040, -3.016405],
        [48.200040, -3.016905],
        [48.200040, -3.014805],
        [48.199040, -3.014605]
    ]).addTo(miniMap);
});
