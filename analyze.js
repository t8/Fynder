let allWords = [];
let longestWords = [];
let avgWordLength = 0;

let loadingBanner = document.getElementById("banner");

chrome.extension.onMessage.addListener(function(words) {
    //console.log("GOT A RESPONSE");
    //loadingBanner.innerText = "GOT A RESPONSE";
    // Waiting for the return of the string
    separateTheCrap(words);
    //loadingBanner.style.display = 'initial';
});

function removeCodeRef(html){
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

Object.prototype.in = function() {
    for(var i = 0; i < arguments.length; i++){
        if(arguments[i] === this) {
            return true;
        }
    }
    return false;
};

function separateTheCrap(palabra) {
    //palabra = removeCodeRef(palabra);
    allWords = palabra.split("\S");
    // A bit of analysis here
    for(let i = 0; i < allWords.length; i++) {
        allWords[i].replace("\W", "");
        // for(let x = 0; x < allWords[i].length; x++) {
        //     if(allWords[i].charAt(x).in("'", ".", ":", ",")) {
        //         allWords[i].charAt(x).splice(x, 2);
        //     }
        // }
        if (allWords[i] === "" || allWords[i] === "-" || allWords[i] === "+" || allWords[i] === "/" || allWords[i] === ",") {
            allWords.splice(i, 1);
        }
        allWords[i].split("/(?=[A-Z])/");
        if (allWords[i].includes(" ")) {
            allWords[i].split(" ");
        }
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
        if (allWords[i]) {
            if (allWords[i].length > 13) {
                max += 1;
            } else {
                longestWords.push(allWords[i]);
            }
        } else {
            max += 1;
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
    let wordCount = allWords.length;
    return wordCount;
}

function showTheMortals() {
    // Removing Banner
    loadingBanner.style.display = 'none';

    // Populating words
    console.log(longestWords);
    for(let i = 0; i < 10; i++) {
        let lItem = document.createElement('li');
        let text = document.createTextNode(longestWords[i].toLowerCase());
        lItem.appendChild(text);
        let place = document.getElementById("top");
        console.log(place);
        place.appendChild(lItem);
        //place.insertItemBefore(lItem);
    }

    // Setting Word Count
    document.getElementById("count").innerText = findWordCount().toString();

    // Setting Avg Word Length
    document.getElementById("length").innerText = findAverageWordLength().toString();
}

window.onload = function() {
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id},
            function(activeTabs) {
                chrome.tabs.executeScript(
                    activeTabs[0].id, {file: 'wordFinder.js', allFrames: true});
            });
    });
};