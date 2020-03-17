/*
This runs after chartRollup and will use the title/artist in /rollup/splits/####.csv to get the YTid
read through the list of csv files and fetch the YTid where it does not exist
Pass the number of the csv file to restict processing to a single file
*/
// e.g. nodejs scripts/getYTid charts numbers

const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const location = args[0]; // e.g. charts
const category = args[1]; // e.g. numbers

var os = require("os");

const fs = require('fs-extra');
var glob = require('glob');
const path = require('path');

const splitEasy = require("csv-split-easy");
const readline = require('readline');

const {
    execSync
} = require("child_process");

var YTID = '';
const dirpath = path.join(__dirname, '../' + location);
var directoryPath = '';
//console.log(dirpath);
//if (category === undefined) {
//    directoryPath = dirpath + '/matches/*/*.match';
//} else {
//    directoryPath = dirpath + '/matches/' + category + '/*.match';
//}
    directoryPath = dirpath + '/matches.csv';

glob(directoryPath, function (err, files) {
    if (err) {
        console.log(err);
    }
    numFilesToRead = files.length;
console.log(numFilesToRead + ' match files found!');
    files.forEach(function (file) {
        try {
            processLineByLine(file);
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
    i = 1;
    //let i = 0;
    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        let csvLine = splitEasy(line);
        if (csvLine[0][0] == 'YTID') {

            let title = csvLine[0][1];
            let artist = csvLine[0][2];
            let titleArtist = title + ' ' + artist;
//if (artist === 'TAYLOR SWIFT') {
            YTID = getYTID(titleArtist);
//} else {
//    YTID = "YDID";
//}

            console.log(i + ' - ' + YTID);
            i++;
            let newLine = line.replace('YTID', YTID);
            console.log(line);

            dataString += newLine + os.EOL;
        }
    }

    //let myFile = file.concat('.temp');
    //console.log(myFile);
    fs.writeFileSync(file, dataString); //overwrite the csv file

}

function getYTID(titleArtist) {

    let cmd = 'youtube-dl --ignore-errors --get-id "ytsearch1:' + titleArtist + '" | awk \'{print $1}\'';
    //console.log(cmd);
    try {

        var res = execSync(cmd).toString().replace(os.EOL, '');

        return res;

    } catch {
        console.log('Error');
    }

    return res;
}
