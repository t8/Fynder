var words = document.body.innerText;
console.log("THE SCRIPT IS IN THE DESTINATION");
chrome.extension.sendMessage(words);