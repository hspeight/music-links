/*
Read match files and generate the json to be used for the skill q & a
*/
// e.g. nodejs scripts/genClipData charts numbers
const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const location = args[0]; // e.g. charts
//const category = args[1]; // e.g. numbers
const matches = require('../chartshs/matches');

var os = require("os");
const csv = require('csvtojson')

var fs = require('fs');
var glob = require('glob');
const path = require('path');

//const splitEasy = require("csv-split-easy");
const readline = require('readline');

const {
    execSync
} = require("child_process");

const dirpath = path.join(__dirname, '../' + location);
//const directoryPath = dirpath + '/matches/' + category + '/*.match';
const directoryPath = dirpath + '/matches.csv';
const csvConcatFile = '/tmp/hs.csv';
const csvConcatFile2 = '/tmp/hs2.csv';
const jsonPath = dirpath + '/matches.json';

if (fs.existsSync(csvConcatFile)) {
    try {
        fs.unlinkSync(csvConcatFile)
        //file removed
    } catch (err) {
        console.error(err)
    }
}

//const config = require('config');
const AWS = require('aws-sdk');
//const accessKeyId = config.get('AWS.accessKeyId');
//const secretAccessKey = config.get('AWS.secretAccessKey');
//const region = config.get('AWS.region');
AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log('got gredentials');
        //var accessKeyId = AWS.config.credentials.accessKeyId;
        //var secretAccessKey = AWS.config.credentials.secretAccessKey;
        //console.log("Access key:", AWS.config.credentials.accessKeyId);
        //console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
        //console.log("Region: ", AWS.config.region);

    }
});

const s3 = new AWS.S3({
    accessKeyId: AWS.config.credentials.accessKeyId,
    secretAccessKey: AWS.config.credentials.secretAccessKey
});

glob(directoryPath, function (err, files) {

    if (err) {
        console.log(err);
    }
    numFilesToRead = files.length;
    files.forEach(function (file, i) {
        try {
            concatFile(file);
        } catch (err) {
            console.error(err);
        }
    });

    readConcatFileByLine(csvConcatFile);
});

async function concatFile(file) {

    let data = fs.readFileSync(file, 'UTF-8');

    try {
        fs.appendFileSync(csvConcatFile, data);
        console.log(csvConcatFile + ' The "data to append" was appended to file!');
    } catch (err) {
        console.error('Append error');
        /* Handle the error */
    }

}

async function readConcatFileByLine(file) {

    const fileStream = fs.createReadStream(file);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    //let matchVal = path.parse(file).name.split('.')[0]; //remove the extension from the file name
    //console.log('>' + matchVal);
    var dataString = '';
    for await (const line of rl) {
        dataString += line +
            os.EOL;
    }

    fs.writeFileSync(csvConcatFile2, dataString);

    let jsonArray = await makeJSON();

    uploadToS3(jsonArray);
}

async function makeJSON() {

    //Allow up to 10 questions per clip (overkill i hope!)
    cmd = 'sed -i "1i clip.id,clip.title,clip.artist,clip.peakpos,clip.woc,' +
        'clip.qanda.0.source,clip.qanda.0.category,clip.qanda.0.difficulty,clip.qanda.0.answer,' +
        'clip.qanda.1.source,clip.qanda.1.category,clip.qanda.1.difficulty,clip.qanda.1.answer,' +
        'clip.qanda.2.source,clip.qanda.2.category,clip.qanda.2.difficulty,clip.qanda.2.answer,' +
        'clip.qanda.3.source,clip.qanda.3.category,clip.qanda.3.difficulty,clip.qanda.3.answer,' +
        'clip.qanda.4.source,clip.qanda.4.category,clip.qanda.4.difficulty,clip.qanda.4.answer,' +
        'clip.qanda.5.source,clip.qanda.5.category,clip.qanda.5.difficulty,clip.qanda.5.answer,' +
        'clip.qanda.6.source,clip.qanda.6.category,clip.qanda.6.difficulty,clip.qanda.6.answer,' +
        'clip.qanda.7.source,clip.qanda.7.category,clip.qanda.7.difficulty,clip.qanda.7.answer,' +
        'clip.qanda.8.source,clip.qanda.8.category,clip.qanda.8.difficulty,clip.qanda.8.answer,' +
        'clip.qanda.9.source,clip.qanda.9.category,clip.qanda.9.difficulty,clip.qanda.9.answer" ' +
        csvConcatFile2;
    y = execSync(cmd).toString();

    // Async / await usage
    const jsonArray = await csv().fromFile(csvConcatFile2);
    //console.log(JSON.stringify(jsonArray));
    fs.writeFileSync(jsonPath, JSON.stringify(jsonArray));

    return jsonArray;

}

function uploadToS3(jsonArray) {
//console.log(jsonArray)
    //create an array of id from the json file
    const idMap = jsonArray.map(function (obj) {
        let rObj = {};
        rObj = obj.clip.id;
        return rObj;
    })

    //console.log(map1);
    // Setting up S3 upload parameters
    const params = {
        Bucket: 'myfactstack-factbucket-nun4lwkrw2rh',
        Key: 'clipIDs.json', // File name you want to save as in S3
        Body: JSON.stringify(idMap)
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
}