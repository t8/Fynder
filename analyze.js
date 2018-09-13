let allWords = [];
let longestWords = [];
let avgWordLength = 0;

chrome.extension.onMessage.addListener(function(words) {
    // Waiting for the return of the string
    separateTheCrap(words);
});

function removeCodeRef(html){
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

function separateTheCrap(palabra) {
    palabra = removeCodeRef(palabra);
    allWords = palabra.split(" ");

    // A bit of analysis here
    for(let i = 0; i < allWords.length; i++) {
        if (allWords[i].includes("↵")) {
            allWords[i].split("↵");
        }
        if (allWords[i].includes(".")) {
            allWords[i].split(".");
        }
        if (allWords[i] === "" || allWords[i] === "-" || allWords[i] === "+" || allWords[i] === "/") {
            allWords.splice(i, 1);
        }
        allWords[i].replace('\'\"', '');
        allWords[i].split(/(?=[A-Z])/);
    }
    allWords = allWords.filter(function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    });
    findLongestWords();
}

function findLongestWords() {
    allWords.sort(function(a, b) {
        // ASC  -> a.length - b.length
        // DESC -> b.length - a.length
        return b.length - a.length;
    });
    let max = 10;
    for(let i = 0; i < max; i++) {
        if (allWords[i].length > 13) {
            max += 1;
        } else {
            longestWords.push(allWords[i]);
        }
    }
    showTheMortals();
}

function findAverageWordLength() {
    for(let i = 0; i < allWords.length; i++) {
        avgWordLength += allWords[i].length;
    }
    avgWordLength /= allWords.length;
    return avgWordLength.toPrecision(3);
}

function findWordCount() {
    wordCount = allWords.length;
    return wordCount;
}

function showTheMortals() {
    // Removing Banner
    let loadingBanner = document.getElementById("banner");
    loadingBanner.style.display = 'none';

    // Populating words
    for(let i = 0; i < 10; i++) {
        let lItem = document.createElement('li');
        let text = document.createTextNode(longestWords[i].toLowerCase());
        lItem.appendChild(text);
        document.getElementById("top").appendChild(lItem);
    }

    // Setting Word Count
    document.getElementById("count").innerText = findWordCount().toString();

    // Setting Avg Word Length
    document.getElementById("length").innerText = findAverageWordLength().toString();
}

window.onload = function() {
    // document.getElementById('download0').onclick = downloadCheckedLinks;
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id},
            function(activeTabs) {
                chrome.tabs.executeScript(
                    activeTabs[0].id, {file: 'wordFinder.js', allFrames: true});
            });
    });
};