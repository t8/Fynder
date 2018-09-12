var allWords = [];

chrome.extension.onMessage.addListener(function(words) {
    // Waiting for the return of the string
    separateTheCrap(words);
});

function separateTheCrap(palabra) {
    // do analyzations here with the big string
    allWords = palabra.split(" ");
    for(var i = 0; i < allWords.length; i++) {
        if (allWords[i].includes("↵")) {
            allWords[i].split("↵");
        } else if (allWords[i] === "") {
            allWords.splice(i, 1);
        }
    }
    console.log(allWords);
}

function findLongestWords() {
    // Find longest words here
}

function findAverageWordCount() {
    //Duh
}

function findWordCount() {
    //duh
}

function showTheMortals() {
    //lol
}

window.onload = function() {
    // document.getElementById('download0').onclick = downloadCheckedLinks;
    console.log("Did get here");
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id},
            function(activeTabs) {
                chrome.tabs.executeScript(
                    activeTabs[0].id, {file: 'wordFinder.js', allFrames: true});
            });
    });
};