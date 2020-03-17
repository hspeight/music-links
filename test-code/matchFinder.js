// e.g.  node test-code/matchFinder 100 charts INSTRUMENTS

//const crypto = require('crypto');
//const lineReader = require('line-reader');
const path = require('path');
const fs = require('fs');
var glob = require('glob');
//const regexes = require('./regexes');
const categories = require('../../lambda/custom/categories');

var matches = [];
var keys = [];
//const myRegex = /\bone\b|\btwo\b|\bthree\b|\bfour\b|\bfive\b|\bsix\b|\bseven\b|\beight\b|\bnine\b|\bten\b|\beleven\b/i;
//const myRegex = /\"/i; // use a double quote to count all rows matched

const regPosition = /[0-9]/; //regex to test against value in position column
// Add these to regex:
// sixteen, seventeen, nineteen, twenty, twenty one, twenty four, fifty, sixty four

const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const top = args[0]; // e.g. 20 to interrogate only top twenty records
const location = args[1]; // e.g. charts
const category = args[2].toLowerCase(); // e.g. NUMBERS, ANIMALS, etc

//const values = regexes.reg[grouping];
const values = categories.categories[category].values;
//console.log(values);
const arr = values.split(',')

let str = '';
arr.forEach((element, i) => {
    str += '\\b(' + element + ')\\b';
    if (i + 1 < arr.length) str += '|';
});
//console.log(arr);
//const myRegex = new RegExp(str, 'gim');
//var hashArray = [];
//const prefix = '7501-';
const dirpath = path.join(__dirname, '../' + location);
//const directoryPath = path.join(__dirname, '../charts/' + prefix + mask);
const directoryPath = dirpath + '/rollup/splits/*.csv';

glob(directoryPath, function (err, files) {
    if (err) {
        console.log(err);
    }
    files.forEach(function (file) {
        try {
            // read contents of the file
            const data = fs.readFileSync(file, 'UTF-8');
//console.log(file);
            // split the contents by new line
            const lines = data.split(/\r?\n/);

            // process all lines
            lines.forEach((line, i) => {
                console.log(line);
                if (line.length !== 0) { // last line appears to be empty
                    let position = line.split(',')[3].replace(/['"]+/g, ''); //third column is position
                    if (position.match(regPosition) && parseInt(position) <= top) { //if it's a heading row there will be no digits
                        for (i = 0; i < 2; i++) {
                            arr.forEach(element => {
                                //console.log(element);
                                let regexMatched = checkEntry(line, element, i);
                                //console.log(line);

                                if (regexMatched) {
                                    matches.push({
                                        id: regexMatched,
                                        entry: line // need to insert matched value into column 1 for use by genClipData.js
                                    });
                                    //console.log(regexMatched + '/' + line);
                                }
                            });

                        }

                    }
                }
            });
        } catch (err) {
            console.error(err);
        }

    });
    //console.log(matches);
    write_data();
});

function checkEntry(line, element, i) {
    // Lines are in this format:
    //"7501","7501-19930710","8","20","WHAT'S UP","4 NON BLONDES","INTERSCOPE","8","4"

    let arr = line.split(',');
    let title = arr[1];
    let artist = arr[2];

    const myRegex = new RegExp("\\b" + element + "\\b", 'i'); // match whole words only
    //console.log(i + '-' + title + '-' + artist);
    if ((i === 0 && title.match(myRegex)) || (i === 1 && artist.match(myRegex))) {
        //if (title.match(myRegex) || artist.match(myRegex)) {
        //let str = title + artist ; // create unique hashes for title & artist
        //var hash = crypto.createHash('md5').update(str).digest('hex');
        //console.log(myRegex);

        //if (!hashArray.includes(hash)) {
            let matchedVal = '';
            if (title.match(myRegex)) {
                matchedVal = title.match(myRegex)[0];
            } else {
                if (artist.match(myRegex)) {
                    matchedVal = artist.match(myRegex)[0];
                }
            }
            //hashArray.push(hash);
            return matchedVal;
        //} else {
        //    return undefined;
        //}
    } else {
        return undefined;
    }

}

async function write_data() {
    // line below from https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    matches.sort((a, b) => (a.id > b.id) ? 1 : -1); // sort the matches array

    var dir = dirpath + '/matches/' + category.toLowerCase();
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var logStream = '';
    //console.log(matches);

    matches.forEach(element => {
        key = element.id;
        data = element.entry;
        if (!keys.includes(key)) {
            keys.push(key);
            // create a new file with the key name and write all entries of that key into it
            logStream = fs.createWriteStream(dir + '/' + key + '.match', {
                flags: 'w'
            });
            //await logStream.write(data + '\r\n');
            writeIt(logStream, data);
            //console.log('create' + key);

        } else {
            writeIt(logStream, data);
        }
    });
}

async function writeIt(logStream, data) {
    await logStream.write(data + '\r\n');
}