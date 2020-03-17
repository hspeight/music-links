
var glob = require('glob');
const path = require('path');
const directoryPathWild = path.join(__dirname, '../clips/*/*.mp3');
const uploadPath = path.join(__dirname, '../upload/');
//const uploadPath = '/mnt/s3bucket/';
const { exec } = require("child_process");

glob(directoryPathWild, function (err, files) {
    if (err) {
        console.log(err);
    }
    files.forEach(function (file) {
        let start = file.length - 15; // Get the start position of the URL ID
        let URLID = file.substr(start, 11); // YT video url ID's are currently 11 charachters long
        console.log(URLID);
        let cmd = 'ffmpeg -y -i "' + file + '" -b:a 48k -ar 16000 "' + uploadPath + URLID + '.mp3"';
        console.log(cmd);
        exec(cmd, (error, stdout, stderr) => {
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
    });
});

console.log('syncing to S3');
//sync to s3
let cmd = 'aws s3 sync upload s3://hs-music-links --acl public-read';
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

