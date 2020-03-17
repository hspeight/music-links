const path = require('path');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const splitEasy = require("csv-split-easy");
const _ = require("lodash")

var os = require("os");
const qaStartElement = 5;
const qaElementCount = 4;
const categories = require('../lambda/custom/categories');
const {
  execSync
} = require("child_process");

const sources = ['title', 'artist'];
var matchArray = [];
//const myRegex = /\bone\b|\btwo\b|\bthree\b|\bfour\b|\bfive\b|\bsix\b|\bseven\b|\beight\b|\bnine\b|\bten\b|\beleven\b/i;
//const myRegex = /\"/i; // use a double quote to count all rows matched
//const fastcsv = require('fast-csv');
const regPosition = /[0-9]/; //regex to test against value in position column
// Add these to regex:
// sixteen, seventeen, nineteen, twenty, twenty one, twenty four, fifty, sixty four

const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array
const location = args[0]; // e.g. charts

var dirpath = path.join(__dirname, '../' + location);
//const ws = fs.createWriteStream(dirpath + '/matches.csv');

const instream = fs.createReadStream(dirpath + '/matches.csv');


const outstream = new(stream);
const rl = readline.createInterface(instream, outstream);

rl.on('line', function (line) {
  
  //let qaArray = [];
  let csvLine = splitEasy(line);

  if (line.includes('#')) {
    let myline = csvLine[0].slice(0,qaStartElement);
    console.log('<' + '\"' + csvLine[0].toString().split(',').join('\",\"') + '\"');
    let myArray = csvLine[0].slice(qaStartElement);
    let c1 = _.chunk(myArray, qaElementCount);
   // console.log(c1.toString());
    data = '';
    c1.forEach(element => {
      //console.log(element.toString());
      data += (element[0] + ',' + element[2] + ',' + element[3] + ':' + element[1] + os.EOL);
      //console.log('!' + data + '!');
    });
    data = data.substring(0, data.length - 1);
    let lines = lineBuilder(data);
    //console.log('>' + lines + '<'); // get rid of last newline)
    let qaArray =  lines.split('\n');
    let qaString = '';
    qaArray.forEach(element => {
      qaString += element;
    });
    let theLineWeWant = myline + ',' + qaString.substring(0, qaString.length - 1);
    //console.log(theLineWeWant);
    console.log('\"' + theLineWeWant.split(',').join('\",\"') + '\"');
    //console.log(splitEasy(qaString).toString());
}

function lineBuilder(data) {


  let cmd = 'echo "' + 
          data + 
          '" | awk -F: \'{if(a[$1])a[$1]=a[$1]"^"$2; else a[$1]=$2;}END{for (i in a)print i, a[i] ",";}\' OFS=,';
  //console.log(cmd);
  var y = execSync(cmd).toString();
  //y = y.substring(0, y.length - 1); // get rid of last newline;
  //console.log('- - - - - - - -');
  //console.log('^'+y+'^');
  //console.log('- - - - - - - - - - - - - - - -');

  return y; // get rid of last newline)
}

});

rl.on('close', function () {

     console.log('done it man!');
    // do something with the array of matches
    //console.log(matchArray.toString());


})
