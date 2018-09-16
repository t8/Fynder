<img src="logo.png" align="right" width="128" height="128" />

# Fynder
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5166543939d840468d8cbd39692750a5)](https://www.codacy.com/app/tbaumer22/Fynder?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tbaumer22/Fynder&amp;utm_campaign=Badge_Grade)

A simple Google Chrome Extension that pulls the best vocabulary words on any website of your choice!

## Features

- Finds the top 15 vocabulary words of any website
- Displays the total word count of the site
- Retrieves the average word length of the article

## Development Steps

- `git clone https://github.com/tbaumer22/Fynder.git`
- `npm install`
- Navigate to `chrome://extensions/`
- Click `Load unpacked`
    - Select the `src` folder
    
### Editing Code

This project includes node dependencies that are not normally compatible with direct web application development. As a way around this, I implemented Browserify, a simple tool to "compile" all dependencies into one JS file to run on the web.

To take advantage of this, any changes you make to the project need to be in the nodeAnalysis.js file. After you finish your edits, `cd` into the `src/analyzations` folder and type:
```browserfiy nodeAnalysis.js -o webAnalysis.js```

This converts the previous file into a JS file to run on the extension.

### Submitting Changes

Any edits to improve the speed, efficiency, or add new features are happily welcomed. Please make a pull-request into Master if you'd like to do so.


(c) 2018 Tate Berenbaum

Special thanks to Marnix Bouhuis