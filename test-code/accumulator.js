const fs = require('fs');
var glob = require('glob');
//const regex = /art/gi;
const directoryPathWild = 'charts/json/7501-202001*';
var bigArray = [];
const regex1 = /\[/g;
const regex2 = /\]/g;

glob(directoryPathWild, function (err, files) {
    if (err) {
        console.log(err);
    }
    files.forEach(function (file, i) { // synchronous
        try {
            console.log(file);
            // read contents of the file
            let data = fs.readFileSync(file, 'UTF-8');
            if (i > 0) { // remove left square barckets except the first
                data = data.replace(regex1, '');
            }
            if (i != files.length - 1) { // remove right square barckets except the last
                data = data.replace(regex2, '');
            }
            bigArray.push(data);
        } catch (err) {
            console.error(err);
        }
        if (i === files.length - 1) {
            console.log('done');
            //console.log(bigArray);

            //console.log(JSON.stringify(bigArray));
            //fs.writeFileSync(path + 'ALLCHARTS' + '-' + Date.now() + '.json', JSON.stringify(bigArray));
            fs.writeFileSync('charts/' + 'ALLCHARTS' + '-' + Date.now() + '.json', bigArray);

        }

    });
});

//fs.writeFileSync(path + 'ALLCHARTS' + '-' + Date.now() + '.json', JSON.stringify(bigArray));