// e.g.  nodejs scripts/matchFinder 100 charts INSTRUMENTS

const path = require('path');
//const fs = require('fs');
const fs = require('fs-extra');
const readline = require('readline');
const stream = require('stream');
const splitEasy = require("csv-split-easy");
var os = require("os");
const _ = require("lodash")
const writtenNumber = require('written-number');
const timestamp = require('time-stamp');

const categories = require('../lambda/custom/categories');

const sources = ['title', 'artist'];
var matchArray = [];
const qaStartElement = 5;
const qaElementCount = 4;
const matchSeperator = '~';
const difficulty = 9;
//const myRegex = /\bone\b|\btwo\b|\bthree\b|\bfour\b|\bfive\b|\bsix\b|\bseven\b|\beight\b|\bnine\b|\bten\b|\beleven\b/i;
//const myRegex = /\"/i; // use a double quote to count all rows matched
const fastcsv = require('fast-csv');
const regPosition = /[0-9]/; //regex to test against value in position column
// Add these to regex:
// sixteen, seventeen, nineteen, twenty, twenty one, twenty four, fifty, sixty four

const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const top = args[0]; // e.g. 20 to interrogate only top twenty records
const location = args[1]; // e.g. charts
var cat = args[2]; // e.g. numbers, animals, etc
const {
    execSync
} = require("child_process");

var dirpath = path.join(__dirname, '../' + location);
const matchFile = dirpath + '/matches.csv';
const matchFileBackup = dirpath + '/backup/matches_' + timestamp.utc('YYYYMMDDHHmmss') + '.csv';

// make a bcakup copy of the csv file before going any further
fs.copyFileSync(matchFile, matchFileBackup, (err) => {
    if (err) throw err;
});

const ws = fs.createWriteStream(matchFile);

const instream = fs.createReadStream(dirpath + '/rollup/splits/0001.csv');
//const instream = fs.createReadStream(dirpath + '/rollup/splits/0001big.csv');
//const instream = fs.createReadStream(dirpath + '/rollup/splits/0001small.csv');

const outstream = new(stream);
const rl = readline.createInterface(instream, outstream);

rl.on('line', function (line) {

    let newLine = checkCategories(line);
    if (newLine != null) {
        matchArray.push(newLine + os.EOL);
    }

});

rl.on('close', function () {


    ws.on('error', () => {
        console.error('ERROR WRITING TO FILE!');
    });

    ws.on('finish', () => {
        console.log('wrote all data to file');
    });

    matchArray.forEach(function (matched) {

        let m = consolidateQA(matched);

        ws.write(m);
    });

    ws.end();

})

function checkCategories(line) {

    let match = false;
    let csvLine = splitEasy(line);
    let a2 = [];
    // Lines are in this format: "YTID","DARK HORSE","KATY PERRY FT JUICY J","4","45"
    for (var [category, value] of Object.entries(categories.categories)) {
        //if (category != 'colors' && category != 'numbers' && category != 'animals' && category != 'astronomy') {
        //    continue;
        //}

        var values = value.values;
        var arr = values.split(',');
        if (categories.categories[category].hasOwnProperty('homophone')) {
            //console.log(categories.categories[category].homophone.split(','));
            altAnsArr = categories.categories[category].homophone.split(',');
        } else {
            altAnsArr = [];
        }

        arr.forEach(element => {
            let replacer = element;
            //see if there is a match in the array of alternate answers
            altFound = false;
            altAnsArr.forEach(el => {
                if (el.split(':')[0] == element) { //An alternate answer matched the value
                    replacer = el.split(':')[1];
                    altFound = true;
                    //console.log(replacer)
                }
                
            });
            if (! altFound) {
                //console.log('---------->' + element);
                if (! isNaN(element)) {
                    //Convert the value to words if it is numeric
                    replacer = writtenNumber(element);
                }
            }
            //console.log(replacer);

            for (i = 0; i < 2; i++) {
                res = checkTitArt(csvLine, element, i); // send title or artist with 
                if (res) {
                    match = true;
                    let qaKey = sources[i] + '-' + category;
                    a2.push(qaKey);
                    line += ',"' + sources[i] + '","' + replacer + '","' + category + '"' + ',"' + difficulty + '"';
                }
            }
        })
    }

    return match ? line : null; //return the matched line or nowt
}

function checkTitArt(csvLine, element, i) {
    // Return the matched value if the title or artist contains the search value
    let title = csvLine[0][1];
    let artist = csvLine[0][2];
    const myRegex = new RegExp("\\b" + element + "\\b", 'i'); // match whole words only

    if ((i === 0 && title.match(myRegex)) || (i === 1 && artist.match(myRegex))) {
        let matchedVal = '';
        if (title.match(myRegex)) {
            matchedVal = title.match(myRegex)[0];
        } else {
            if (artist.match(myRegex)) {
                matchedVal = artist.match(myRegex)[0];
            }
        }
        return matchedVal;
    } else {
        return undefined;
    }
}

function consolidateQA(line) {

    let csvLine = splitEasy(line);

    let myline = csvLine[0].slice(0, qaStartElement);
    let myArray = csvLine[0].slice(qaStartElement);

    let c1 = _.chunk(myArray, qaElementCount);
    //console.log(c1);

    data = '';
    c1.forEach(element => {
        //0=source,1=answer,2=category,3=difficulty
        data += (element[0] + ',' + element[2] + ',' + element[3] + ':' + element[1] + os.EOL);
    });
    data = data.substring(0, data.length - 1);

    let lines = lineBuilder(data);
    //console.log(lines);
    let qaArray = lines.split('\n');
    let qaString = '';
    qaArray.forEach(element => {
        qaString += element;
    });

    let theLineWeWant = myline + ',' + qaString.substring(0, qaString.length - 1);
    theLineWeWant = '\"' + theLineWeWant.split(',').join('\",\"') + '\"' + os.EOL;
    //console.log(theLineWeWant);
    return theLineWeWant;
}

function lineBuilder(data) {

    let cmd = 'echo "' +
        data +
        '" | awk -F: \'{if(a[$1])a[$1]=a[$1]"' + matchSeperator + '"$2; else a[$1]=$2;}END{for (i in a)print i, a[i] ",";}\' OFS=,';

    var y = execSync(cmd).toString();

    return y;
}