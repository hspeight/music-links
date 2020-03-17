//
//e.g. node test-code/getYTinfo numbers
//
const {
    execSync
} = require("child_process");
var os = require("os");
const crypto = require('crypto');
const path = require('path');
var glob = require('glob');
const fs = require('fs');
const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const category = args[0].toLowerCase(); // e.g. numbers, animals, etc
var hashArray = [];
const quote = '"';
var replace = '"';
var re = new RegExp(replace, "g");
const songDest = '../csv/songs/' + category + '.csv';
//console.log(songDest);
const songDataDest = '../csv/songdata/' + category + '.csv';

/*
if (fs.existsSync(songDest)) { // delete the category file if it exists.
    //console.log('The path exists.');
    try {
        fs.unlinkSync(songDest)
        //file removed
    } catch (err) {
        console.error(err)
    }
}
*/
if (fs.existsSync(songDataDest)) { // delete the category file if it exists.
    //console.log('The path exists.');
    try {
        fs.unlinkSync(songDataDest)
        //file removed
    } catch (err) {
        console.error(err)
    }
}
const directoryPath = path.join(__dirname, '../matches/' + category + '/*');

glob(directoryPath, function (err, files) {
    if (err) {
        console.log(err);
    }
    files.forEach(function (file) {
        try {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' + file);
            // read contents of the file
            const data = fs.readFileSync(file, 'UTF-8');

            // split the contents by new line
            const lines = data.split(/\r?\n/);
            // process all lines
            lines.forEach((line, i) => {
                let arr = line.split(',');
                let title = arr[4];
                let artist = arr[5];
                if (title !== undefined) {
                    let str = title.concat(artist); // create unique hashes for title & artist
                    //console.log(str);
                    var hash = crypto.createHash('md5').update(str).digest('hex');
                    //console.log(myRegex);
                    if (!hashArray.includes(hash)) {
                        let cmd = 'youtube-dl --skip-download "ytsearch1:' + title.replace(re, '') +
                            ' ' + artist.replace(re, '') + '" | egrep "Downloading webpage"';
                        //console.log(cmd);
                        // extract video id and remove trailing colon
                        let ytid = execSync(cmd).toString().split(' ')[1];
                        ytid = ytid.substring(0, ytid.length - 1);
                        //console.log(title + ',' + artist + ',' + '"https://youtu.be/' + ytid + quote);
                        //let songCSV = quote + ytid + '",' + title + ',' + artist;
                        let songDataCSV = quote + ytid + '",' + title + ',' + artist + ',"' + category + quote;
                        //console.log(songCSV);
                        console.log(songDataCSV);
                        //fs.writeFileSync(__dirname + '/../csv/songs/hstest.csv', songCSV + os.EOL);
                        fs.writeFileSync(__dirname + '/../csv/songdata/hstest.csv', songDataCSV + os.EOL);

                    }
                    hashArray.push(hash);
                }
            });
        } catch (err) {
            console.error(err);
        }

    });
    //write_data();
});