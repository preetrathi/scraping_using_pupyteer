const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("************************************************************* CODE RUN FROM HERE *********************************************************************")
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--start-fullscreen'
        ]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto('https://websitedemos.net/organic-shop-02//');
    const url = page.url();
    console.log("Getting Page URL -----> ", url)

    const getClass = await page.evaluate(() => {
        const classname = Array.from(document.getElementsByTagName('section'), section => section.className);
        const div = Array.from(document.getElementsByTagName('div'), div => div.className);
        return { classname, div }
    })

    var secClass = [];
    for (var i = 0; i < getClass.classname.length; i++) {
        secClass.push("." + getClass.classname[i].replaceAll(" ", "."))
    }

    var global_data = fs.readFileSync(process.cwd() + "\\attributes.txt").toString();
    listOfAttributies = global_data.split('\n');
    console.log(listOfAttributies,"List of attributes ==========================================>")

    const grabeData = await page.evaluate(({ listOfAttributies, secClass }) => {
        var secCSS = [];
        for (var i = 0; i < secClass.length; i++) {
            var tem = document.querySelector(secClass[i])
            for (var j = 0; j < listOfAttributies; j++) {
                var attribute = listOfAttributies[j].replaceAll('\r', '');
                secCSS.push(
                    getComputedStyle(tem).getPropertyValue(attribute)
                )
            }



        }

        const classname = Array.from(document.getElementsByTagName('section'), section => section.className);

        var p = classname[0]

        const a = document.querySelector(".elementor-heading-title.elementor-size-default")
        const childCSS = JSON.parse(JSON.stringify(getComputedStyle(a)))

        const section = document.querySelector(".elementor-section.elementor-top-section.elementor-element.elementor-element-a584ef8.elementor-section-content-middle.elementor-reverse-mobile.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default")
        sectionAttributes = section.getAttributeNames();
        sectionChilds = section.children;
        childsLength = sectionChilds.length;
        sectionChildsAtt = sectionChilds[0].getAttributeNames();
        childClass = sectionChilds[0].className;
        return secCSS;
        // sectionAttributes,
        // sectionChilds,
        // sectionChildsAtt,
        // childsLength,
        // childClass,
        // childCSS,

        // classname


    }, {listOfAttributies, secClass})
    console.log("Grabbing Data From Page -----> ", grabeData)
    await browser.close()
})();