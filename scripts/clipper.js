/* 
Use youtube-dl to download a snippet of audio from a youtube vid starting at X for Y seconds
Can be run for all gategories, a single category or a single ty url
Usage:
    nodejs scripts/clipper 00:00:40 00:00:20 all (all clips found in matches.json)
    nodejs scripts/clipper --location chartshs --category numbers (all clips in category numbers. start defaults to 0 and duration defaults to 20)
    nodejs scripts/clipper --ytid lpkLcfbOra4 --start 0 --duration 10
*/
const qaCategories = require('../lambda/custom/categories');
const matches = require('../chartshs/matches');
const altmatches = require('../chartshs/altmatch');
const path = require('path');
const readline = require('readline');

//const fs = require('fs');
const fs = require('fs-extra');
var ytid = '';
var s, d = '00:00:00';
const yargs = require('yargs');
const argv = yargs
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    //.command("count", "Count the lines in a file")
    .alias('y', 'ytid')
    .alias('s', 'start')
    .alias('d', 'duration')
    .alias('c', 'category')
    .alias('l', 'location')
    .example("$0 ytid -y BdRgsmiN_0f", "call youtube-dl to download the clip")
    .argv

const s3Bucket = 'hs-music-links';
var location = '';
var categories = [];
var validCategories = Object.keys(qaCategories.categories);

const {
    execSync
} = require("child_process");

var dirpath = path.join(__dirname, '../' + location + '/clips/');
const mp3Dir = '/mnt/s3bucket/';
if (!fs.existsSync(mp3Dir)) {
    console.log('Directory ' + mp3Dir + ' not found!');
    return process.exit();
}

//start processing here
processArgs();

async function processArgs() {
    if (argv.hasOwnProperty('ytid')) {
        ytid = argv.ytid;
        s = '00:00:'.concat(argv.start.toString().padStart(2, '0')); //currently cannot start after 60 secs
        d = '00:00:'.concat(argv.duration.toString().padStart(2, '0'));
        console.log(`ID is ${ytid} start=${s} - duration=${d}`);
        IDs.push(ytid);
    }
    if (argv.hasOwnProperty('category')) {

        location = argv.location;
        s = '00:00:00';
        d = '00:00:20';

        if (location != 'charts' && location != 'chartshs') {
            console.log('Invalid location!');
            return process.exit();
        }
        console.log(argv.category)
        if (argv.category.toLowerCase() === 'all') {
            await seekConfirmation();
            console.log('OK.. Overwriting all clips!');

            //categories = ['astronomy', 'state_capitals'];
            categories = validCategories;
        
        } else {
            categories = argv.category.split(','); //user could enter something like numbers,colors,animal
        }

        doWork();

    }
}
async function seekConfirmation() {
    const ans = await askQuestion("Are you sure you want to overwrite ALL clips? Answer YES to proceed.");
    if (ans.toLowerCase() != 'yes') {
        return process.exit();
    }
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}


function doWork() {
// loop all entered categories
categories.forEach(el => {
    if (validCategories.includes(el)) {
        console.log(`= = = category ${el} = = =`);
        IDs = getIDsForCat(el);
        //Loop round all ytid's
        IDs.forEach(element => {
            //can we get these from the object?
            if (d == '00:00:00') {
                d = '00:00:20';
            }
            /*
            Object.entries(altmatches).forEach(e => {
                e[1].clipinfo.forEach(l => {
                console.log(l.id)
                })
            })
            */
            let url = 'https://youtu.be/'.concat(element);
            let cmd = 'youtube-dl --no-mtime -o "' + mp3Dir + element + '.%(ext)s" --extract-audio --audio-format mp3 --audio-quality 48k -x --postprocessor-args "-ss ' +
                s + ' -t ' + d + ' -ar 16000" ' + url;
            //let cmd = `touch ${mp3Dir}${element}.mp3`
            console.log(`${el} ${cmd}`);
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
            })

            doSymlinks(el, element);

        })
    }
})
}

//console.log('done!');

function getIDsForCat(category) {

    IDs = [];
    Object.entries(matches).forEach(entry => {
        entry[1].clip.qanda.forEach(element => {
            if (element.category == category && entry[1].clip.id != 'YTID') {
                if (!IDs.includes(entry[1].clip.id)) {
                    IDs.push(entry[1].clip.id);
                } else {
                    console.log(`${element.category} - ${entry[1].clip.id} exists in idKeys`);
                }
            }
        })
    })
    return IDs;
}

function doSymlinks(category, id) {

    let clipDir = dirpath + category;
    if (!fs.existsSync(clipDir)) {
        console.log('making ' + clipDir);
        fs.mkdirSync(clipDir);
    }
    let clipObj = matches.filter(function (clipData) {
        return clipData.clip.id == id;
    });
    filename = id + '.mp3';
    linkName = clipDir + '/' + id + '_' + clipObj[0].clip.title.replace(/[\s\/\{\}]/g, '_') + '_' 
                                        + clipObj[0].clip.artist.replace(/[\s\/\{\}]/g, '_') + '.mp3';

    if (fs.existsSync(linkName)) {
        try {
            fs.unlinkSync(linkName, (err) => {
                if (err) {
                    console.log(linkName + ' NOT deleted')
                } else {
                    console.log(linkName + ' deleted');
                }
            });
        } catch (error) {
            console.log('Error on fs.unlinkSync. ' + error);
        }
    }

    fs.symlinkSync(mp3Dir + filename, linkName);

    // set public read permision on object
    //filename = '_3J8tKLIToE.mp3'
    cmd = 'aws s3api put-object-acl --bucket ' + s3Bucket + ' --key=' + filename + ' --acl public-read';
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
}