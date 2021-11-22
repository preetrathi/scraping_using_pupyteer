const puppeteer = require('puppeteer');
// const firebase = require('firebase')
const fs = require('fs');
var http = require('http');

var params = function (req) {
    // console.log(req);
    let q = req.url.split('?'), result = {};
    if (q.length >= 2) {
        q[1].split('&').forEach((item) => {
            try {
                result[item.split('=')[0]] = item.split('=')[1];
            } catch (e) {
                result[item.split('=')[0]] = '';
            }
        })
    }
    return result;
}

const puppet = async (req, res) => {
    let d = params(req);
    try {
        let webUrl = d['url'];
            console.log(webUrl)
            let classNames = d['classes'];
            let attributiesVal = d['attri'] || 'all';
            if (webUrl!==undefined && classNames!==undefined && attributiesVal!==undefined  ) {
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--start-maximized' // you can also use '--start-fullscreen'
                ]
            });
            // const { width, height } = screen.getPrimaryDisplay().workAreaSize;
            var page = await browser.newPage();
            await page.setViewport({ width: 1320, height: 750 });
            var listOfAttributies = [];
            await page.goto(webUrl);    //https://websitedemos.net/organic-shop-02/
            var global_data = fs.readFileSync(process.cwd() + "\\attributes.txt").toString();
            listOfAttributies = global_data.split('\n');
            var section = await page.evaluate(({ listOfAttributies, classNames, attributiesVal }) => {
                if (attributiesVal === 'all') {
                    var listOfSec = [];
                    var elements = document.querySelector(classNames);
                    for (var index = 0; index < listOfAttributies.length; index++) {
                        var attrib = listOfAttributies[index].replaceAll('\r', '');
                        var data = [];
                        data.push(attrib);
                        data.push(getComputedStyle(elements).getPropertyValue(attrib));
                        listOfSec.push(data);
                    }
                    return JSON.parse(JSON.stringify(listOfSec));// getComputedStyle(elements).getPropertyValue('padding');// JSON.parse(JSON.stringify(getComputedStyle(elements)));

                } else {
                    var elements = document.querySelector(classNames);

                    // res.write(getComputedStyle(elements).getPropertyValue(attributiesVal)); // Write a response
                    // res.end(); // End the response
                    return { attributiesVal: getComputedStyle(elements).getPropertyValue(attributiesVal) };
                }

            }, { listOfAttributies, classNames, attributiesVal });
            console.log(section);
            await browser.close();
            return section;
        }else {
            return 'Record not found';
        }
        
        
    } catch (exce) {
        console.log(exce);
    }
};
http.createServer(async function (req, res) {

    let d = await puppet(req, res);
    console.log("D VAlue", d);
    res.write(JSON.stringify(d)); // Write a response
    res.end(); // End the response
    // console.log(res)
}).listen(3001, function () {
    console.log("server start at port 3000"); // The server object listens on port 3000
});
