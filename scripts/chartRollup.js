/*
Concat all charts files into a single file then roll up into unique title/artist file 
*/

// e.g. nodejs scripts/chartRollup charts
const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const location = args[0]; // e.g. charts

var os = require("os");
const csv = require('csvtojson');

var fileArray = [];

const fs = require('fs-extra');
var glob = require('glob');
const path = require('path');

const splitEasy = require("csv-split-easy");
const readline = require('readline');

const {
    execSync
} = require("child_process");

var numFilesToRead = 0;
var recordsPerFile = 1000000;

const dirpath = path.join(__dirname, '../' + location);
let cmd = 'cat ' + dirpath + '/7501-* > ' + dirpath + '/rollup/allcharts.temp'; // concat all chart files in the dirctory into a temp file
var y = execSync(cmd).toString();
cmd = 'egrep -v \\"Type ' + dirpath + '/rollup/allcharts.temp > ' + dirpath + '/rollup/allcharts.csv'; // get rid of the header rows to create the csv.
y = execSync(cmd).toString();

// bin veverything in the splits directory
fs.emptyDirSync(dirpath + '/rollup/splits');

const directoryPath = dirpath + '/rollup/allcharts.csv';

glob(directoryPath, function (err, files) {
    if (err) {
        console.log(err);
    }
    numFilesToRead = files.length;
    console.log(numFilesToRead);

    files.forEach(function (file) {
        try {
            //console.log(files.length);
            let sortedFile = makeCSVFile(file);
            //console.log(sortedFile);
            processLineByLine(sortedFile);
        } catch (err) {
            console.error(err);
        }
    });

});

async function processLineByLine(file) {
    
    const fileStream = fs.createReadStream(file);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    var dataString = '';
    let i = 0;
    let seq = 0;
    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
            let csvLine = splitEasy(line);
            let title = csvLine[0][0];
            let artist = csvLine[0][1];
            let peak = csvLine[0][3];
            let woc = csvLine[0][4];
            //let titleArtist = title + ' ' + artist;
            let YTID = 'YTID';
            let newLine = '"' + YTID + '","' +
                title + '","' +
                artist + '","' +
                peak + '","' +
                woc + '"' +
                os.EOL;
            dataString += newLine;
            i++;

            if (!(i % recordsPerFile)) {
                seq++;
                let myFile = dirpath + '/rollup/splits/' + seq.toString().padStart(4, '0') + '.csv'; //e.g. 001.csv
                fs.writeFileSync(myFile, dataString);
                var dataString = '';
            i=0;
            }

            fileArray.push(file);

            if (numFilesToRead === fileArray.length) {
                console.log(' i\'m done'); 
            }
    }

    //write the remaing records
    if (i > 0 ) {
        seq++;
        let myFile = dirpath + '/rollup/splits/' + seq.toString().padStart(4, '0') + '.csv'; //e.g. 001.csv
        fs.writeFileSync(myFile, dataString);
    }
}

function makeCSVFile(file) {

    let outfile = dirpath + '/rollup/1.temp';
    let cmd = 'cat ' + file + ' | ' +
        'awk -F "\\"*,\\"*" \'{print $3 "," substr($9, 1, length($9)-2) "," $0}\' | ' +
        'sort --field-separator="," -k7,8 -k2,2nr | sort --field-separator="," -k7,8 -u | ' +
        'awk -v RS=\'\r\n\' -F "\\"*,\\"*" \'{print "\\"" $7 "\\",\\"" $8 "\\",\\"" $9 "\\",\\"" $10 "\\",\\"" $11}\' | tee ' + outfile;

    //console.log('>>>>>>>>>>>>>' + cmd);
    var y = execSync(cmd).toString();

    //console.log(outfile);

    return outfile; // return the file sorted and grouped by title/artist
}
