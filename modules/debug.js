
var debugDiv = document.getElementById('debug');

export function debug(text) {
    debugDiv.innerHTML += text + '<br>';
}