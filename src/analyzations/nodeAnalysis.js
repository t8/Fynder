var wd           = require("word-definition");
var Words	     = require("words.js");
var Types	     = require("words.js").Types;
var Strings	     = require("words.js").Strings;
var allEnglishWords = require("./allEnglishWords");

const englishWords = allEnglishWords.getWords;

let wordList = [];
let englishWordList = [];
let averageWordLength = 0;

// Waiting until a response is given
chrome.extension.onMessage.addListener(function(words) {
    wordList = splitWords(removeCodeRef(words));
    checkWords(removeDuplicates);
});



// ------------ Analysis Functions ------------ //



// Splitting words by key characters
function splitWords(str) {
    let array = splitMulti(str , [
        '\n',
        ' ',
        '    ',
        ':',
        '\"',
        '.',
        '\/',
        '*',
        '&',
        '\,',
        '(',
        ')',
        '_',
        '-',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9'
    ]);
    return array;
}

// Ensuring all words are valid
function checkWords(_call) {
    for(let i = 0; i < wordList.length; i++) {
        if (wordList[i] !== '') {
            wordList[i] = wordList[i].toLowerCase();
            let englishWord = searchBinary(wordList[i], englishWords, true);
            if (englishWord !== wordList[i]) {
                wordList.splice(i, 1);
            }
        } else {
            wordList.splice(i, 1);
        }
    }
    return _call();
}

// Removes Duplicate Words
function removeDuplicates() {
    wordList = wordList.filter(function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    });
    let finalList = orderWords(wordList);
    displayTop(finalList);
    displayWordCount();
    displayWordLength();
}

// Orders the words
function orderWords(list) {
    list.sort(function(a, b) {
        // ASC  -> a.length - b.length
        // DESC -> b.length - a.length
        return b.length - a.length;
    });
    let returnList = [];
    let max = 15;
    for(let i = 0; i < max; i++) {
        if (list[i]) {
            if (list[i].length > 13) {
                max += 1;
            } else {
                returnList.push(list[i]);
            }
        } else {
            max += 1;
        }
    }
    return returnList;
}



// ------------ Helping Functions ------------ //



// Getting rid of script tags
function removeCodeRef(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

// Splitting strings with multiple arguments
function splitMulti(str, tokens) {
    var tempChar = tokens[0]; // We can use the first token as a temporary join character
    for(var i = 1; i < tokens.length; i++){
        str = str.split(tokens[i]).join(tempChar);
    }
    str = str.split(tempChar);
    return str;
}

// Returning to menu
function backToHome() {
    let button = document.getElementById("back-def");
    document.getElementById("def-panel").style.display = 'none';
    document.getElementById("home").style.display = 'initial';
}

// Allowing user to copy text
// ----- STILL IN DEVELOPMENT ----- //
function copyDefinition() {
    let definition = document.getElementById("def-desc");
    let area = document.getElementById("text-to-copy");
    area.innerHTML = definition.innerText;
    // area.addEventListener('copy', function(){
    //     document.execCommand('copy');
    // });
    // let event = new Event('copy');
    // area.dispatchEvent(event);
    chrome.runtime.sendMessage(
        { method: 'setClipboard', value: area.textContent },
        function(response) {
            console.log('extension setClipboard response', response);
        }
    );
    console.log("SUPPOSEDLY COPIED THE TEXT");
}



// ------------ UI Functions ------------ //



function displayTop(topWords) {
    for(let i = 0; i < topWords.length; i++) {
        // Creating element
        let lItem = document.createElement('li');
        let lDef = document.createElement('a');
        lDef.id = "l-"+ i;
        lDef.onclick = function(){displayDefinition(topWords[i])};
        let text = document.createTextNode(topWords[i]);
        lDef.appendChild(text);
        lItem.appendChild(lDef);
        let place = document.getElementById("top");
        place.appendChild(lItem);
    }
    document.getElementById("banner").style.display = 'none';
    // displayDefinition(topWords[0]);
}

function displayWordCount() {
    document.getElementById("count").innerText = wordList.length.toString();
}

function displayWordLength() {
    let avgWordLength = 0;
    for(let i = 0; i < wordList.length; i++) {
        avgWordLength += wordList[i].length;
    }
    avgWordLength /= wordList.length;

    document.getElementById("length").innerText = avgWordLength.toPrecision(3);

}

function displayReadingLevel() {

}

function displayDefinition(word) {
    // Getting definition
    wd.getDef(word, "en", {
        hyperlinks: "html"
    }, function(definition) {
        // Populating information
        document.getElementById("def-title").innerText = word;
        document.getElementById("def-type").innerHTML = definition.category;
        document.getElementById("def-desc").innerHTML = definition.definition;
        // Setting panel
        document.getElementById("def-panel").style.display = 'initial';
        // Removing home
        document.getElementById("home").style.display = 'none';
        // Giving back button logic
        document.getElementById("back-def").onclick = function(){backToHome()};
        // Allowing user to copy definition
        // ----- STILL IN DEVELOPMENT ----- //
        //document.getElementById("def-copy").onclick = function(){copyDefinition()};
    });
}



// ------------ Injection Functions ------------ //



// Injecting JS to find all words
window.onload = function() {
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id},
            function(activeTabs) {
                chrome.tabs.executeScript(
                    activeTabs[0].id, {file: 'wordFinder.js', allFrames: true});
            });
    });
    document.getElementById("def-panel").style.display = 'none';
};