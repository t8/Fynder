var words = document.body.innerText;

console.log("IT SENDS");

chrome.extension.sendMessage(words);