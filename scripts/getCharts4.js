// e.g. time nohup nodejs test-code/getCharts4 2012-10-13 1000 &

const cheerio = require('cheerio');
const fetch = require("node-fetch");
const fs = require('fs');

const args = process.argv.slice(2); // passed args start at element 2 of the process.argv array

var startDate = args[0];
var chartsRequested = args[1];
var IDArray = [];
const delim = '"';
const header = '"Type","ID","Pos","LW","Title","Artist","Label","Peak","WoC"\r\n';
const regex = /\"/g;

const path = 'charts/';
//const firstEverChart = '1952-11-14'
async function processBody() {

  var newdate = new Date(startDate);

  while (IDArray.length < chartsRequested) { // loop this until the number of charts requested has been reached
    var nd = new Date(newdate);
    var chartDate = nd.toISOString().replace(/-/g, '').split('T')[0];

    let url = 'https://www.officialcharts.com/charts/singles-chart/' + chartDate + '/';
    //console.log(chartDate);

    try {
      const response = await fetch(url).then(res => res.text())
        .then(html => processMe(html));
    } catch (error) {
      console.log(error);
    }

    newdate.setDate(newdate.getDate() + 7);

  }
  //console.log(IDArray);
}

processBody();

function processMe(html) {
  
  if (html.includes('our database holds no chart for the date you have requested')) { // no more charts
    chartsRequested = -1;
    return;
  }
  const $ = cheerio.load(html);
  const chartType = $('#this-chart-type').val();
  const chartID = $('#this-chart-id').val();

  if (IDArray.includes(chartID) === false) {
    IDArray.push(chartID);
    console.log(chartType + ' / ' + chartID);

    var rows = header;
    $('table.chart-positions tr').each(function (i, elem) {
      var children = $(this).children();
      let position = ($(this).find('.position').text()).trim();
      let lastW = $(this).find('.last-week').text().trim();
      let title = $(this).find('.title').text().trim().replace(regex, delim + delim) // escape any double quotes;
      let artist = $(this).find('.artist').text().trim().replace(regex, delim + delim) // escape any double quotes;
      let label = $(this).find('.label-cat').text().trim().replace(regex, delim + delim) // escape any double quotes;
      let peak = $(children[3]).text().trim();
      let WoC = $(children[4]).text().trim();
      // check here to make sure they have values before printing
      if (position) {
        //console.log(artist);
        let row = delim + chartType + delim + ',' + delim + chartID + delim + ',' + delim + position + delim + ',' + delim +
          lastW + delim + ',' + delim + title + delim + ',' + delim + artist + delim + ',' + delim + label + delim +
           ',' + delim + peak + delim + ',' + delim + WoC + delim;
        //let tester = title + artist + label;
        //tester.replace(regex, slash + delim) // escape any double quotes
        //if (tester.includes(delim)) {
        //  log('got a quote in ' + chartID + ' !'); // Need to do something if any of those strings contain a quote
        //}
        //console.log(row);
        rows += row + '\r\n';
      }
    });
    
    fs.writeFileSync(path + chartID, rows);

  }

}

