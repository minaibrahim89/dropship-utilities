
var debugSection = document.getElementById('debug');
var debugContent = document.getElementById('debugContent');
var counter = 0;

export function debug(text) {
    debugSection.style.display = 'block';
    debugContent.innerHTML += ++counter + ': ' + text + '<br>--------------<br>';
}