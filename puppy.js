const puppeteer = require('puppeteer');
const firebase = require('firebase');

(async () => {
const firebaseConfig = {
    apiKey: "AIzaSyBp6NWXDV7lXJXbayeg5xfiFWfdoqQCl0I",
    authDomain: "scraping-css.firebaseapp.com",
    projectId: "scraping-css",
    storageBucket: "scraping-css.appspot.com",
    messagingSenderId: "962965035079",
    appId: "1:962965035079:web:339c061af0160763d6f962",
    measurementId: "G-ZXMVCD4BQ8"
}

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    var ref = database.ref("/node_parameters");
    ref.push({
        webURl:'www.google.com',
        pageClass:'.classname',
        propertyValue:'background-color'
    })
    // ref.once("value", function(snapshot){
    //     var data = snapshot.val();
    //     console.log(data)
    // })
    const browser = await puppeteer.launch({headless:false,
        args:[
            '--start-fullscreen'  //'--start-maximized' // you can also use '--start-fullscreen'
        ]
        });
    // const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto('https://websitedemos.net/organic-shop-02//');
    const url = page.url();
    console.log(url)

    const grabData = await page.evaluate(() => {
        const section = document.querySelector(".elementor-section.elementor-top-section.elementor-element.elementor-element-a584ef8.elementor-section-content-middle.elementor-reverse-mobile.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default")
        return section.getAttributeNames()
    })
    console.log(grabData)
    await browser.close();


})();