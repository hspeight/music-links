/* 
Use youtube-dl to download a snippet of audio from a youtube vid starting at X for Y seconds
Usage: node test-code/clipper 00:00:40 00:00:20 lpkLcfbOra4
*/
const fs = require('fs');

const {
    execSync
} = require("child_process");

const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const startTime = args[0]; // e.g. 00:00:50
const length = args[1]; // e.g. 00:00:10
const url = 'https://youtu.be/'.concat(args[2]); // e.g. DbbHXz1pDls
const grouping = args[3]; // e.g. numbers

if (grouping === undefined) {
    process.on('exit', function (code) {
        console.log('Enter the category man!');
        return process.exit();
    });

}
const doubleQuote = '"';
//const dir = './clips/' + grouping.toLowerCase();
const clipBase = './clips/';
const tempDir = clipBase + 'ALL_CLIPS/';

let URLID = url.substr(url.length - 11, 11);
console.log(URLID);
// download the clip once to temp
//let cmd = 'youtube-dl --no-mtime -o "' + tempDir + '%(title)s-%(id)s.%(ext)s" --extract-audio --audio-format mp3 -x --postprocessor-args "-ss ' +
let cmd = 'youtube-dl --no-mtime -o "' + tempDir + URLID + '.%(ext)s" --extract-audio --audio-format mp3 --audio-quality 48k -x --postprocessor-args "-ss ' +
    //let cmd = 'youtube-dl --skip-download --no-mtime -o "' + dir + '/%(title)s-%(id)s.%(ext)s" --extract-audio --audio-format mp3 -x --postprocessor-args "-ss ' +
    startTime + ' -t ' + length + '" ' + url;

execSync(cmd, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

// copy the file from temp into the directory for each grouping specified
const dirs = grouping.split(',');
dirs.forEach(element => {
    // delete the file if it exists
    /*
    fs.stat('./server/upload/my.csv', function (err, stats) {
        console.log(stats);//here we got all information of file in stats variable
        if (err) {
            return console.error(err);
        }
        fs.unlink('./server/upload/my.csv',function(err){
             if(err) return console.log(err);
             console.log('file deleted successfully');
        });  
     });
     */
    // make the directory if it doesn't exist
    let clipDir = clipBase + element;
    if (!fs.existsSync(clipDir)) {
        console.log('making ' + clipDir);
        fs.mkdirSync(clipDir);
    }
    filename = URLID + '.mp3';

    //copy the file from the temp location
    //console.log(tempDir + 'SILVER CONVENTION - get up and boogie (1976) (HQ)-hKGrfC1860o.mp3');
    try {
    fs.unlinkSync(clipDir + '/' + filename, (err) => {
        if (err) {
            console.log(clipDir + '/' + filename + ' NOT deleted')
        } else {
            console.log(clipDir + '/' + filename + ' deleted');
        }
    });
} catch {
    console.log('catch');
}

    fs.symlinkSync('../ALL_CLIPS/' + filename, clipDir + '/' + filename);
});


console.log(doubleQuote + url + '","YT TITLE","' + startTime + '","' + grouping + doubleQuote);

// probbaly need to use ffmpeg to convert bitrate for alexa (unless it can be set by youtube-dl)