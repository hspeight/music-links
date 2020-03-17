/*
Read charts files, roll into unique title/artist records then insert ytid into 1st column
*/
// e.g. nodejs test-code/genClipData4All charts
const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const location = args[0]; // e.g. charts

var os = require("os");
const csv = require('csvtojson')

//const results = [];
var fileArray = [];

var fs = require('fs');
var glob = require('glob');
const path = require('path');

const splitEasy = require("csv-split-easy");
const readline = require('readline');

const {
    execSync
} = require("child_process");

var numFilesToRead = 0;
var rowsPerFile = 10;

const dirpath = path.join(__dirname, '../' + location);
let cmd = 'cat ' + dirpath + '/7501-* > ' + dirpath + '/rollup/allcharts.temp';
var y = execSync(cmd).toString();
cmd = 'egrep -v \\"Type ' + dirpath + '/rollup/allcharts.temp > ' + dirpath + '/rollup/allcharts.csv';
y = execSync(cmd).toString();


// We now have a file with a row for each title/artist with the peak position and weeks on chart in the last two columns
//const dirpath = path.join(__dirname, '../' + location);
const directoryPath = dirpath + '/rollup/allcharts.csv';
console.log(directoryPath);
glob(directoryPath, function (err, files) {
    if (err) {
        console.log(err);
    }
    numFilesToRead = files.length;
    console.log(numFilesToRead);
    //return process.exit();

    files.forEach(function (file) {
        try {
            console.log(files.length);
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
        //if (line.startsWith('7501', 1)) { // look for lines starting with 7501 in the second position
            //console.log('###' + line);

            let csvLine = splitEasy(line);
            //console.log(csvLine);
            let title = csvLine[0][0];
            let artist = csvLine[0][1];
            let titleArtist = title + ' ' + artist;
            //let YTID = getYTID(titleArtist);
            let YTID = 'YTID';
            let newLine = '"' + YTID + '","' +
                //line.substring(6) + // get rid of the first bit of the date string from line
                title + '","' +
                artist + '"' +
                os.EOL;
            dataString += newLine;
            i++;
//console.log('==================================');
//console.log(dataString);
//console.log('==================================');

            if (!(i % 100)) {
                seq++;
                //console.log(seq.toString().padStart(3, '0'));
                let myFile = dirpath + '/rollup/splits/' + seq.toString().padStart(3, '0') + '.csv'; //e.g. 001.csv
                fs.writeFileSync(myFile, dataString);
                var dataString = '';
            i=0;
            }

// need to write last file when last record has been read

            //fs.writeFileSync(myFile, dataString);

            fileArray.push(file);
            //console.log('==========');
            //console.log(fileArray);
            //console.log('==========');

            if (numFilesToRead === fileArray.length) {
                console.log(' i\'m done'); 
            }
        //}
    }

    //write the remaing records
    if (i > 0 ) {
        seq++;
        myFile = dirpath + '/rollup/splits/' + seq + '.csv';
        fs.writeFileSync(myFile, dataString);
    }
}

function getYTID(titleArtist) {

    let cmd = 'youtube-dl --ignore-errors --get-id --prefer-insecure "ytsearch1:' + titleArtist + '" | awk \'{print $1}\'';
    //console.log('^^^ ' + titleArtist + '/' + cmd);
    try {
        
        var res = execSync(cmd).toString().replace(os.EOL, '');
        //console.log('>' + res.replace(os.EOL, '') + '<');
        //let bits = res.split(' ');
        //let y = bits[1].replace(/:/, '');
        return res;
        
       //return 'YoUtubeiD-.';
    } catch {
        console.log('Error');
    }

    return res;
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

async function appendFiles() {

    let jsonOutputFile = path.join(__dirname, '../matches/' + category + '/' + category + '.json');
    //let csvOutputFile = dirpath + '.csv');

    // ditch the json output file if it exists
    if (fs.existsSync(csvOutputFile)) {
        try {
            fs.unlinkSync(csvOutputFile)
            //file removed
        } catch (err) {
            console.error(err)
        }
    }

    fileArray.forEach(async element => {

        let data = fs.readFileSync(element, 'UTF-8');

        try {
            fs.appendFileSync(csvOutputFile, data + os.EOL);
            //console.log('The "data to append" was appended to file!');
        } catch (err) {
            console.error('Append error');
            /* Handle the error */
        }

    });

    cmd = 'sed -i "1i clip.id,clip.peakdate,clip.title,clip.artist,clip.label,clip.peakpos,clip.woc,' +
        'clip.qandq.0.category,clip.qandq.0.source,clip.qandq.0.answer,clip.qandq.0.difficulty,' +
        'clip.qandq.1.category,clip.qandq.1.source,clip.qandq.1.answer,clip.qandq.1.difficulty" ' + //only for 2nd cat
        csvOutputFile;
    y = execSync(cmd).toString();

    // Async / await usage
    const jsonArray = await csv().fromFile(csvOutputFile);
    console.log(JSON.stringify(jsonArray));
}

function makeqanda(val, matchVal, i) {

    console.log(val);
    if (val.includes(matchVal)) {
        console.log(val + ' includes ' + matchVal);
        return true;
    } else {
        return false;
    }


    //let extrabit = artist === matchVal ? '","diff cat' : '';


}