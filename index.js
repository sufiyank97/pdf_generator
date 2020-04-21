
const express = require('express')
const fs = require('fs-extra')
const hbs = require('handlebars')
const path = require('path')
const moment = require('moment')
const pdf = require('express-pdf')
const app = express()
const file1 = path.join(process.cwd(), 'templates')
app.use(express.json())
app.use(express.static(file1))
app.use(pdf)
const port = process.env.PORT || 3004;






const compile = async (templateName, data) => {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`)
    console.log(filePath)
    const html = await fs.readFileSync(filePath, { encoding: 'utf-8' })
    hbs.registerHelper('breaklines', function (text) {
        text = hbs.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
        return new hbs.SafeString(text);
    });
    hbs.registerHelper('dateFormat', function (value, format) {
        return moment(value).format(format)
    })
    let data1 = {}
    data.map(d1 => {
        d1.name = d1.name.replace('E1.1', 'E11')
        d1.name = d1.name.replace('E1.2', 'E12')
        d1.name = d1.name.replace('E1.3', 'E13')
        data1[d1.name] = d1.value
    })

    return hbs.compile(html)(data1);
}

const main = async (a1) => {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    })
    const page = await browser.newPage()
    const content = await compile('short-list', a1)
    // await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
    await page.setContent(content)
    // await page.goto(`data:text/html,${content}`, { waitUntil: 'networkidle0' })
    await page.emulateMediaType('screen')
    // const file1 = path.join(process.cwd(), 'templates/')
    // console.log(file1)
    // console.log(__dirname)
    const pdf = await page.pdf({
        path: 'mypdf.pdf',
        format: 'A4',
        margin: "none",
        printBackground: true
        // base: 'file:///' + file1
    })
    return pdf
}


app.post('/new', async function (req, res) {
    try {
        // const content = await compile('short-list', req.body.values)
        // console.log(content)
        // res.pdfFromHTML({
        //     filename: 'generated.pdf',
        //     htmlContent: content,
        //     options: {
        //         format: 'A3',
        //         margin: "none",
        //         printBackground: true
        //     }
        // });
        const pdf = await main(req.body.values);
        res.contentType("application/pdf");
        res.send(pdf);
        // var file = path.join(__dirname, 'mypdf.pdf');
        // res.contentType("application/pdf");
        // res.download(file, function (err) {
        //     if (err) {
        //         console.log("Error");
        //         console.log(err);
        //     } else {
        //         console.log("Success");
        //     }
        // });
    } catch (e) {
        console.log('error', e)
    }
})
app.listen(port, () => {
    console.log("listening on port", port);
    console.log(file1)
});

