// e.g. time nohup node test-code/getCharts4 2012-10-13 1000 &

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

const path = 'charts/json/';
var charts = [];
var myObj = {};
var bigArray = [];

//const firstEverChart = '1952-11-14'
async function getWeekChart() {

  var newdate = new Date(startDate);

  while (IDArray.length < chartsRequested) { // loop this until the number of charts requested has been reached
    var nd = new Date(newdate);
    var chartDate = nd.toISOString().replace(/-/g, '').split('T')[0];

    let url = 'https://www.officialcharts.com/charts/singles-chart/' + chartDate + '/';
    //console.log(chartDate);
    //let myObj = {};

    charts = [];

    try {
      const response = await fetch(url).then(res => res.text())
        .then(html => myObj = processWeekChart(html));
    } catch (error) {
      console.log(error);
    }

    newdate.setDate(newdate.getDate() + 7);

    if (chartsRequested > -1) {
      fs.writeFileSync(path + myObj.chartID + '.json', JSON.stringify(charts));
      //console.log(bigArray.concat(charts));
      //bigArray = bigArray.concat(charts);
      bigArray.push(charts);
    } else {
      console.log('All done!');
      fs.writeFileSync(path + 'ALLCHARTS' + '-' + Date.now() + '.json', JSON.stringify(bigArray));
    }

  }

  //console.log(bigArray);

  // all requested charts should now be in charts object
  //fs.writeFileSync(path + 'charts.json', JSON.stringify(charts));
  //fs.writeFileSync(path + 'charts.json', JSON.stringify(bigArray));

}

function processWeekChart(html) {

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

    $('table.chart-positions tr').each(function (i, elem) {
      let position = ($(this).find('.position').text()).trim();
      // check here to make sure they have values before printing
      if (position) {
        myObj = {};
        myObj.chartType = chartType;
        myObj.chartID = chartID;
        myObj.position = ($(this).find('.position').text()).trim();
        myObj.lastW = $(this).find('.last-week').text().trim();
        myObj.title = $(this).find('.title').text().trim().replace(regex, delim + delim) // escape any double quotes;
        myObj.artist = $(this).find('.artist').text().trim().replace(regex, delim + delim) // escape any double quotes;
        myObj.label = $(this).find('.label-cat').text().trim().replace(regex, delim + delim) // escape any double quotes;
        let children = $(this).children();
        myObj.peak = $(children[3]).text().trim();
        myObj.WoC = $(children[4]).text().trim();

        charts.push(myObj);

      }
    });

  }

  return myObj;

}

getWeekChart();