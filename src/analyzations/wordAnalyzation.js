var wd        = require("word-definition");
var Words	  = require('words.js');
var Types	  = require('words.js').Types;
var Strings	  = require('words.js').Strings;

var wordList;
let averageWordLength = 0;

// Waiting until a response is given
chrome.extension.onMessage.addListener(function(words) {
    wordList = splitWords(removeCodeRef(words));
    checkWords(removeDuplicates);
});



// ------------ Analyzation Functions ------------ //



//testString = removeCodeRef(testString);
//wordList = new Words(words);
// wordList = splitWords(testString);
// checkWords(removeDuplicates);

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
            wd.getDef(wordList[i], "en", null, function(definition) {
                console.log(definition);
                if (definition.definition === "undefined" || definition.definition === "" || definition.definition === null || definition.err === 'a request has failed') {
                    wordList.splice(i, 1);
                } else {
                    console.log(wordList[i]);
                }
            });
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
}

// Orders the words
function orderWords(list) {
    list.sort(function(a, b) {
        // ASC  -> a.length - b.length
        // DESC -> b.length - a.length
        return b.length - a.length;
    });
    let returnList = [];
    let max = 10;
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
function removeCodeRef(html){
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

// Splitting strings with multiple arguments
function splitMulti(str, tokens){
    var tempChar = tokens[0]; // We can use the first token as a temporary join character
    for(var i = 1; i < tokens.length; i++){
        str = str.split(tokens[i]).join(tempChar);
    }
    str = str.split(tempChar);
    return str;
}



// ------------ UI Functions ------------ //



function displayTop(topWords) {
    for(let i = 0; i < topWords.length; i++) {
        let lItem = document.createElement('li');
        let text = document.createTextNode(topWords[i].toLowerCase());
        lItem.appendChild(text);
        let place = document.getElementById("top");
        place.appendChild(lItem);
    }
    document.getElementById("banner").style.display = 'none';
}

function displayWordCount() {
    document.getElementById("count").innerText = wordList.count().toString();
}

function displayWordLength() {
    let avgWordLength = 0;
    for(let i = 0; i < wordList.length; i++) {
        avgWordLength += allWords[i].length;
    }
    avgWordLength /= allWords.length;

    document.getElementById("length").innerText = avgWordLength.toPrecision(3);

}

function displayReadingLevel() {

}

function displayDefinition(word) {

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
};