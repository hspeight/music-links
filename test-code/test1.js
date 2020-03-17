// this blocks and is working

/*
if key is not in array add it then extend it with qanda
if key is in array extend it with qanda
*/
const path = require('path');
const fs = require('fs');
var glob = require('glob');
const readline = require('readline');
const splitEasy = require("csv-split-easy");

const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const location = args[0]; // e.g. charts

const dirpath = path.join(__dirname, '../' + location);
const directoryPath = dirpath + '/matches/*/*.match';

let idArray = [];
let fileArray = [];

//let clip = '"0zk2PCti8-c","ARMY OF TWO","OLLY MURS","12","16"'

glob(directoryPath, function (err, files) {

    if (err) {
        console.log(err);
    }
    numFilesToRead = files.length;
    files.forEach(function (file, i) {
        try {
            //console.log(file);
            processLineByLine(file);
        } catch (err) {
            console.error(err);
        }
    });

    //readConcatFileByLine(csvConcatFile);
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
            let id = csvLine[0][0];
            console.log(csvLine.toString());

            if (! idArray.includes(id)) {
                idArray.push(id);
            }
            //let artist = csvLine[0][1];
            //let peak = csvLine[0][3];
            //let woc = csvLine[0][4];
            //let titleArtist = title + ' ' + artist;
            //let YTID = 'YTID';
            //let newLine = '"' + YTID + '","' +
            //    title + '","' +
            //    artist + '","' +
            //    peak + '","' +
            //    woc + '"' +
            //    os.EOL;
            //dataString += newLine;
            //i++;

            //if (!(i % recordsPerFile)) {
            //    seq++;
            //    let myFile = dirpath + '/rollup/splits/' + seq.toString().padStart(4, '0') + '.csv'; //e.g. 001.csv
            //    fs.writeFileSync(myFile, dataString);
            //    var dataString = '';
            //i=0;
            //}

            
    }

            fileArray.push(file);
            if (numFilesToRead === fileArray.length) {
                console.log(idArray.length); 
            }

    //write the remaing records
    //if (i > 0 ) {
    //    seq++;
    //    let myFile = dirpath + '/rollup/splits/' + seq.toString().padStart(4, '0') + '.csv'; //e.g. 001.csv
    //    fs.writeFileSync(myFile, dataString);
   // }
}
