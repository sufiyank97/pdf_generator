
const express = require('express')
const fs = require('fs-extra')
const hbs = require('handlebars')
const path = require('path')
const hummus = require('hummus');
const memoryStreams = require('memory-streams');
const moment = require('moment')
const cors = require('cors')

const app = express()
const file1 = path.join(process.cwd(), 'templates')

const PDFRStreamForBuffer = require('./buffer.js');
app.use(cors());
app.use(express.json())
app.use(express.static(file1))
const port = process.env.PORT || 3004;


const compile1 = async (templateName, data, number) => {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`)
    console.log(filePath)
    const html = await fs.readFileSync(filePath, { encoding: 'utf-8' })
    hbs.registerHelper('breaklines', function (text) {
        text = hbs.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
        return new hbs.SafeString(text);
    });

    hbs.registerHelper('breaklines1', function (text) {
        text = hbs.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, '<span style="vertical-align:-37%"> </span><br>');
        return new hbs.SafeString(text);
    });

    hbs.registerHelper('dateFormat', function (value, format) {
        return moment(value).format(format)
    })
    hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
    let data1 = {}
    data.map(d1 => {
        data1[d1.name] = d1.value
    })

    return hbs.compile(html)(data1);
}


const compile = async (templateName, data, addr) => {

    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`)
    console.log(filePath)
    const html = await fs.readFileSync(filePath, { encoding: 'utf-8' })
    hbs.registerHelper('breaklines', function (text) {
        text = hbs.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
        return new hbs.SafeString(text);
    });

    hbs.registerHelper('breaklines1', function (text) {
        text = hbs.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, '<span style="vertical-align:-40%"> </span><br>');
        return new hbs.SafeString(text);
    });

    // hbs.registerHelper('dateFormat', function (value, format) {
    //     return moment(value).format(format)
    // })
    hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
    let data1 = {}
    data.map(d1 => {
        d1.name = d1.name.replace('.', '')
        obj1 = {}

        if ((d1.name === "C21") || (d1.name === "C22") || (d1.name === "C23")) {
            var p = [], n = "", a = d1.value
            a = a.replace(/(“|”)/g, '"')
            a = JSON.parse(a)
            a.map(a1 => {
                if (a1["Section of the report"] === n) {
                    p.push({
                        "report": "",
                        "number": a1["Element Number"],
                        "name": a1["Element Name"]
                    })
                } else {
                    p.push({
                        "report": a1["Section of the report"],
                        "number": a1["Element Number"],
                        "name": a1["Element Name"]
                    })
                }
                n = a1["Section of the report"]
            })
            data1[d1.name] = p
        }

        else {
            if (addr) {
                if (d1.value.includes('{')) {
                    d1.value = d1.value.replace(/(“|”)/g, '"')
                    d1.value = JSON.parse(d1.value)
                    data1[d1.name] = d1.value
                    data1["proper"] = addr.A09
                }
            }
            if (d1.name === "D93") {
                var arr = d1.value.split(',').map(word => word.trim())
                if (arr.includes('Gas'))
                    obj1["Gas"] = "Gas"
                if (arr.includes('Electricity'))
                    obj1["Electricity"] = "Electricity"
                if (arr.includes('Water'))
                    obj1["Water"] = "Water"
                if (arr.includes('Drainage'))
                    obj1["Drainage"] = "Drainage"
                data1[d1.name] = obj1
            } else if (d1.name === "D94") {
                var arr = d1.value.split(',').map(word => word.trim())
                if (arr.includes('Gas'))
                    obj1["Gas"] = "Gas"
                if (arr.includes('Electric'))
                    obj1["Electric"] = "Electric"
                if (arr.includes('Solid Fuel'))
                    obj1["Solid Fuel"] = "Solid Fuel"
                if (arr.includes('Oil'))
                    obj1["Oil"] = "Oil"
                if (arr.includes('None'))
                    obj1["None"] = "None"
                data1[d1.name] = obj1
            } else {
                if (d1.rating === "") {
                    data1[d1.name] = d1.value
                } else {
                    data1[d1.name] = {
                        "value": d1.value,
                        "rating": d1.rating
                    }
                }
            }

        }

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
    var cssb = [];
    cssb.push('<style>');
    cssb.push(`.t0 {
        width: 460px;
        font: 16px 'Calibri';
        color: #ffffff;
    }.tr0 {
        height: 30px;
    }.td0 {
        padding: 0px;
        margin: 0px;
        width: 1000px;
        vertical-align: bottom;
        background-color: #0086c1;
    }

    .td1 {
        padding: 0px;
        margin: 0px;
        width:200px;
        vertical-align: bottom;
        background-color: #0086c1;
    }.ft3 {
        font: 12px 'Calibri';
        color: #ffffff;
        line-height: 19px;
    }.p8 {
        text-align: left;
        padding-left: 10px;
        margin-top: 0px;
        margin-bottom: 0px;
        white-space: nowrap;
    }

    .p9 {
        text-align: left;
        margin-top: 0px;
        
        margin-bottom: 0px;
        white-space: nowrap;
    }
    .tr1 {
        height: 5px;
    }
    .p9 {
        text-align: left;
        margin-top: 0px;
        margin-bottom: 0px;
        white-space: nowrap;
    }
    .ft4 {
        font: 1px 'Calibri';
        line-height: 14px;
    }
`);
    cssb.push('</style>');
    const css = cssb.join('');
    let header1 = `
    <header style="-webkit-print-color-adjust: exact;margin-left:70em;">
        <TABLE cellpadding=0 cellspacing=0 class="t0">
            <TR>
                <TD class="tr0 td0">
                    <P class="p8 ft3">RESIDENTIAL VALUATION REPORT</P>
                </TD>
                <TD class="tr0 td1">
                    <P class="p9 ft3">5th September 2019</P>
                </TD>
            </TR>
            <TR>
                <TD  style="
                background: #00b0de;">
                    <P class="p9 ft4">&nbsp;</P>
                </TD>
                <TD  style="
                background: #00b0de;">
                    <P class="p9 ft4">&nbsp;</P>
                </TD>
            </TR>
        </TABLE>
    </header>
    `

    var addr = {}
    a1.map(a => {
        a.name = a.name.replace('.', '')
        if (a.name === "A3") {
            console.log(a.value.split('\n'))
            addr[a.name] = a.value.split('\n')[0].toUpperCase()
        }
    })
    let content1 = await compile1('coverpdf1', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const page1 = await page.pdf({
        format: 'A4',
        // path: "coverPage.pdf",
        pageRanges: '1',
        printBackground: true
    })
    content1 = await compile1('short-list', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const remainingPages = await page.pdf({
        // path: 'mypdf.pdf',
        format: 'A4',

        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: css + header1,
        footerTemplate: `<footer style="font-size:8px;margin-left:9em;">
        <div class="drawline" style="width: 57em;
        border-bottom: 15px solid #00afde;
        background-color: #00afde;">
        </div>
        <TABLE cellpadding=0 cellspacing=0 class="t2">
            <TR>
                <TD class="tr7 td8">
                    <P class="p9 ft8">${addr.A3}</P>
                </TD>
                <TD class="tr7 td9" style="padding-left:41em;">
                    <P class="pageNumber"></P>
                </TD>
            </TR>
        </TABLE>
    </footer>`,
        margin: {
            top: '110px',
            bottom: '100px',
            right: '30px',
            left: '40px'
        }
    })
    const combinePDFBuffers = async (page1, remainingPages) => {
        var outStream = new memoryStreams.WritableStream();

        try {
            var page1 = new hummus.PDFRStreamForBuffer(page1);
            var remainingPages = new hummus.PDFRStreamForBuffer(remainingPages);

            var pdfWriter = hummus.createWriterToModify(page1, new hummus.PDFStreamForResponse(outStream));

            pdfWriter.appendPDFPagesFromPDF(remainingPages);

            pdfWriter.end();
            var newBuffer = outStream.toBuffer();
            outStream.end();
            return newBuffer;
        }
        catch (e) {
            outStream.end();
            console.log('Error during PDF combination: ' + e.message);
        }
    };
    var result = await combinePDFBuffers(page1, remainingPages);
    return result;

}



app.post('/new', async function (req, res) {
    try {
        const result = await main(req.body.values);

        res.setHeader('Content-Type', 'application/pdf');
        res.send(result)

    } catch (e) {
        console.log('error', e)
    }
})

async function base64_encode(file) {
    // read binary data
    const filePath = path.join(process.cwd(), 'templates/images', `${file}`)
    console.log(filePath)
    var bitmap = await fs.readFile(filePath, { encoding: 'base64' });
    // convert binary data to base64 encoded string
    return bitmap
}

const headerFunction = (image, imageWidth, tableMarginLeft, textWidth, tdPadding, text) => {
    if (image) {
        const html = `
    <div style="margin-top:15em;">
            <table style="margin:0em ${tableMarginLeft}em 0em">
                <tr>
                    <td>
                        <img src="data:image/jpeg;base64,${image}" width="${imageWidth}em">
                    </td>
                    <td style="padding-left:${tdPadding}em;">
                        <div style="font-family: Arial, Helvetica, sans-serif;
            line-height: 1.7em;
            font-size:20px;
            border-bottom: 0.5px solid #a0a4b0;
            border-width: medium;
            width: ${textWidth}em;">${text}</div>
                    </td>
                </tr>
            </table>
        </div>
    `
        return html
    } else {
        const html = `<div style="margin-top:15em;">
        <table style="margin:0em ${tableMarginLeft}em 0em">
            <tr>
                <td>
                   
                </td>
                <td style="padding-left:${tdPadding}em;">
                <div style="font-family: Arial, Helvetica, sans-serif;
                line-height: 1.7em;
                font-size:20px;
                border-bottom: 0.5px solid #a0a4b0;
                border-width: medium;
        width: ${textWidth}em;">${text}</div>
                </td>
            </tr>
        </table>
    </div>
`
        return html
    }
}
const main1 = async (a1) => {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],

    })


    const page = await browser.newPage()
    var addr = {}
    a1.map(a => {
        a.name = a.name.replace('.', '')
        if (a.name === "A09") {
            addr[a.name] = a.value.replace('\n', ' ').trim()
        }
    })
    // <P style="text-align:left;padding-left:42px;color:#a0a4b0;">Property address</P>
    var rics = await base64_encode('rics.jpg')
    var ricshomebuyer = await base64_encode('RicsHomeuyerReport.jpg')
    var B = await base64_encode('homebuyer/B.jpg')
    var C = await base64_encode('homebuyer/C.jpg')
    var D = await base64_encode('homebuyer/D.jpg')
    var E = await base64_encode('homebuyer/E.png')
    var F = await base64_encode('homebuyer/F.png')
    var G = await base64_encode('homebuyer/G.jpg')
    var H = await base64_encode('homebuyer/H.png')
    var I = await base64_encode('homebuyer/I.png')
    var J = await base64_encode('homebuyer/J.png')
    var K = await base64_encode('homebuyer/K.jpg')
    var L = await base64_encode('homebuyer/L.png')

    var Fi1 = await base64_encode('homebuyer/homeFinal.jpg')
    let footeradr = `
    <div id="footer-template" style="font-size:10px !important;padding-left:10px">
        
    <table style="margin-left: 1.6em;">
    <tr>
    <td>
        <P style="margin-left:-2em;text-align:left;padding-left:42px;color:#a0a4b0;font-size:11px;">Property address</P>
    </td>
    <td>
        <div style="
                border: 1px solid #a0a4b0;
                width: 39em;height:2em;
            margin-left: -7em;
            ">
            <p style="margin-top: -0em;padding-left: 1em;padding-top: 0.7em;font-size:8px;">${addr.A09}</p>
        </div>
    </td>
    </tr>
            <tr>
                <td>
                    <img src="data:image/jpeg;base64,${rics}" width="180em">
                </td>
                <td style="padding-left: 13em;">
                    <img src="data:image/jpeg;base64,${ricshomebuyer}" width="230em">
                </td>
            </tr>
        </table>
    </div>
    `



    const headerC = `
                < div style = "margin-top:15em;" >
                    <table style="margin:0em 70em 0em">
                        <tr>
                            <td>
                                <img src="data:image/jpeg;base64,${C}" width="30em">
                    </td>
                                <td style="padding-left:30em;">
                                    <div style="font-family: Arial, Helvetica, sans-serif;
            line-height: 1.2em;
            font-size:20px;">Overall opinion and summary of the condition ratings</div>
                                    <div style="margin-top:6em;border-bottom: 0.5px solid #a0a4b0;border-width: medium;width: 400em;"></div>
                                </td>
                </tr>
            </table>
        </div>
            `



    // headers
    const headerb = headerFunction(B, '30', '70', '20', '30', 'About the Inspection')
    const headerd = headerFunction(D, '30', '70', '20', '30', 'About the property')
    const headere = headerFunction(E, '25', '70', '20', '40', 'Outside the property')
    const headerf = headerFunction(F, '25', '70', '20', '40', 'Inside the property')
    const headerg = headerFunction(G, '30', '70', '19.5', '40', 'Services')
    const headerh = headerFunction(H, '30', '70', '20', '30', 'Grounds (including shared areas for flats)')
    const headeri = headerFunction(I, '14', '70', '21', '30', 'Issues for your legal advisers')
    const headerj = headerFunction(J, '16', '70', '20.5', '30', 'Risks')
    const headerk = headerFunction(K, '32', '60', '20', '30', 'Valuation')
    const headerl = headerFunction(L, '32', '60', '20', '40', "Surveyor's declaration")
    const headerFinal = headerFunction('', '', '90', '20', '40', "What to do now")
    const headerFinal1 = headerFunction('', '', '90', '20', '40', "Typical house diagram")
    let content1 = await compile('homebuyercover', a1, addr)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h1 = await page.pdf({
        // path: 'homebuyercover.pdf',
        printBackground: true,
        format: 'A4',
    })

    content1 = await compile('homeB', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h2 = await page.pdf({
        // path: 'homeB.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerb,
        footerTemplate: footeradr,
        margin: {
            top: '100px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeC', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h3 = await page.pdf({
        // path: 'homeC.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerC,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeD', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h4 = await page.pdf({
        // path: 'homeD.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerd,
        footerTemplate: footeradr,
        margin: {
            top: '100px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeE', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h5 = await page.pdf({
        // path: 'homeE.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headere,
        footerTemplate: footeradr,
        margin: {
            top: '110px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeF', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h6 = await page.pdf({
        // path: 'homeF.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerf,
        footerTemplate: footeradr,
        margin: {
            top: '110px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeG', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h7 = await page.pdf({
        // path: 'homeG.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerg,
        footerTemplate: footeradr,
        margin: {
            top: '110px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeH', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h8 = await page.pdf({
        // path: 'homeH.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerh,
        footerTemplate: footeradr,
        margin: {
            top: '105px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeI', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h9 = await page.pdf({
        // path: 'homeI.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headeri,
        footerTemplate: footeradr,
        margin: {
            top: '105px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeJ', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h10 = await page.pdf({
        // path: 'homeJ.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerj,
        footerTemplate: footeradr,
        margin: {
            top: '105px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeK', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h11 = await page.pdf({
        // path: 'homeK.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerk,
        footerTemplate: footeradr,
        margin: {
            top: '105px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeL', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h12 = await page.pdf({
        // path: 'homeL.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerl,
        footerTemplate: footeradr,
        margin: {
            top: '105px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeFinal', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h13 = await page.pdf({
        // path: 'homeFinal.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerFinal,
        footerTemplate: footeradr,
        margin: {
            top: '105px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeFinal1', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h14 = await page.pdf({
        // path: 'homeFinal.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerFinal1,
        footerTemplate: footeradr,
        margin: {
            top: '105px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })


    const combinePDFBuffers = async (array) => {
        var outStream = new memoryStreams.WritableStream();

        try {

            var h1 = new hummus.PDFRStreamForBuffer(array[0]);
            var pdfWriter = hummus.createWriterToModify(h1, new hummus.PDFStreamForResponse(outStream));
            array.shift()
            array.forEach(a1 => {
                var a1 = new hummus.PDFRStreamForBuffer(a1);
                pdfWriter.appendPDFPagesFromPDF(a1);
            })
            pdfWriter.end();
            var newBuffer = outStream.toBuffer();
            outStream.end();
            return newBuffer;
        }
        catch (e) {
            outStream.end();
            console.log('Error during PDF combination: ' + e.message);
        }
    };
    var result = await combinePDFBuffers([h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14]);
    return result;
}
app.post('/new1', async (req, res) => {
    try {
        var result = await main1(req.body.values);
        var outStream = new memoryStreams.WritableStream();
        var pdfInserPageNumber = await hummus.createWriterToModify(new PDFRStreamForBuffer(result), new hummus.PDFStreamForResponse(outStream));
        const filePath1 = path.join(process.cwd(), `Poppins-Regular.ttf`)
        console.log(filePath1)
        var getFont = pdfInserPageNumber.getFontForFile(filePath1);
        var textOptions = { font: getFont, size: 10, colorspace: 'gray', color: 'black' };

        console.log(pdfInserPageNumber)
        var totalPages = await hummus.createReader(new PDFRStreamForBuffer(result)).getPagesCount()
        var pageNumber;
        for (pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
            if (pageNumber === 1) {
                console.log(' ')
            } else {
                var pageModifier = new hummus.PDFPageModifier(pdfInserPageNumber, pageNumber - 1, true);
                pageModifier.startContext().getContext().writeText(String(pageNumber), 520, 805, textOptions);
                pageModifier.endContext().writePage();
            }
        }
        pdfInserPageNumber.end();
        res.contentType("application/pdf");
        res.send(outStream.toBuffer())
    } catch (e) {
        console.log('error', e)
    }
})


const main2 = async (a1) => {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    })
    const page = await browser.newPage()
    var addr = {}
    a1.map(a => {
        a.name = a.name.replace('.', '')
        if (a.name === "A09") {
            addr[a.name] = a.value.replace('\n', ' ')
        }
    })
    // <P style="text-align:left;padding-left:42px;color:#a0a4b0;">Property address</P>
    var rics = await base64_encode('rics.jpg')
    var ricshomebuyer = await base64_encode('RicsHomeuyerReport.jpg')
    var B = await base64_encode('homebuyer/B.jpg')
    var C = await base64_encode('homebuyer/C.jpg')
    var D = await base64_encode('homebuyer/D.jpg')
    var E = await base64_encode('homebuyer/E.png')
    var F = await base64_encode('homebuyer/F.png')
    var G = await base64_encode('homebuyer/G.jpg')
    var H = await base64_encode('homebuyer/H.png')
    var I = await base64_encode('homebuyer/I.png')
    var J = await base64_encode('homebuyer/J.png')
    var K = await base64_encode('homebuyer/K.jpg')
    var L = await base64_encode('homebuyer/L.png')
    var Fi1 = await base64_encode('homebuyer/homeFinal.jpg')
    let footeradr = `
    < div id = "footer-template" style = "font-size:10px !important;padding-left:10px" >

        <table style="margin-left: 1.6em;">
            <tr>
                <td>
                    <P style="margin-left:-2em;text-align:left;padding-left:42px;color:#a0a4b0;font-size:11px;">Property address</P>
                </td>
                <td>
                    <div style="
                border: 1px solid #a0a4b0;
                width: 39em;height:2em;
            margin-left: -7em;
            ">
                        <p style="margin-top: -0em;padding-left: 1em;padding-top: 0.7em;font-size:8px;">${addr.A09}</p>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <img src="data:image/jpeg;base64,${rics}" width="180em">
                </td>
                    <td style="padding-left: 13em;">
                        <img src="data:image/jpeg;base64,${ricshomebuyer}" width="230em">
                </td>
            </tr>
        </table>
    </div>
    `
    const headerC = `
    <div style="margin-top:15em;">
                    <table style="margin:0em 70em 0em">
                        <tr>
                            <td>
                                <img src="data:image/jpeg;base64,${C}" width="30em">
                    </td>
                                <td style="padding-left:30em;">
                                    <div style="font-family: Arial, Helvetica, sans-serif;
            line-height: 1.2em;
            font-size:20px;">Overall opinion and summary of the condition ratings</div>
                                    <div style="margin-top:6em;border-bottom: 0.5px solid #a0a4b0;border-width: medium;width: 400em;"></div>
                                </td>
                </tr>
            </table>
        </div>
    `
    // headers
    const headerb = headerFunction(B, '30', '70', '20', '30', 'About the Inspection')
    const headerd = headerFunction(D, '30', '70', '20', '30', 'About the property')
    const headere = headerFunction(E, '25', '70', '20', '40', 'Outside the property')
    const headerf = headerFunction(F, '25', '70', '20', '40', 'Inside the property')
    const headerg = headerFunction(G, '30', '70', '19.5', '40', 'Services')
    const headerh = headerFunction(H, '30', '70', '20', '30', 'Grounds (including shared areas for flats)')
    const headeri = headerFunction(I, '14', '70', '21', '30', 'Issues for your legal advisers')
    const headerj = headerFunction(J, '16', '70', '20.5', '30', 'Risks')
    const headerk = headerFunction(K, '32', '60', '20', '30', 'Energy efficiency')
    const headerl = headerFunction(L, '32', '60', '20', '40', "Surveyor's declaration")
    const headerFinal = headerFunction('', '', '90', '20', '40', "What to do now")
    const headerFinal1 = headerFunction('', '', '90', '20', '40', "Typical house diagram")


    let content1 = await compile('homebuildercover', a1, addr)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h1 = await page.pdf({
        // path: 'Survey.pdf',
        printBackground: true,
        format: 'A4',
    })
    content1 = await compile('surveyB', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h2 = await page.pdf({
        // path: 'surveyB.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerb,
        footerTemplate: footeradr,
        margin: {
            top: '110px',
            bottom: '117px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyC', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h3 = await page.pdf({
        // path: 'surveyC.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerC,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyD', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h4 = await page.pdf({
        // path: 'surveyD.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerd,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyE', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h5 = await page.pdf({
        // path: 'surveyE.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headere,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyF', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h6 = await page.pdf({
        // path: 'surveyF.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerf,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyG', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h7 = await page.pdf({
        // path: 'surveyG.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerg,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyH', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h8 = await page.pdf({
        // path: 'surveyH.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerh,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyI', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h9 = await page.pdf({
        // path: 'surveyI.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headeri,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyJ', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h10 = await page.pdf({
        // path: 'surveyJ.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerj,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyK', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h11 = await page.pdf({
        // path: 'surveyK.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerk,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('surveyL', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h12 = await page.pdf({
        // path: 'surveyL.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerl,
        footerTemplate: footeradr,
        margin: {
            top: '120px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })

    content1 = await compile('homeFinal', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h13 = await page.pdf({
        // path: 'homeFinal.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerFinal,
        footerTemplate: footeradr,
        margin: {
            top: '105px',
            bottom: '120px',
            right: '30px',
            left: '25px'
        }
    })
    content1 = await compile('homeFinal1', a1)
    await page.setContent(content1)
    await page.emulateMediaType('screen')
    const h14 = await page.pdf({
        // path: 'homeFinal.pdf',
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerFinal1,
        footerTemplate: footeradr,
        margin: {
            top: '105px',
            bottom: '128px',
            right: '30px',
            left: '25px'
        }
    })
    // Merge PDF's Using Buffer
    const combinePDFBuffers = async (array) => {
        var outStream = new memoryStreams.WritableStream();

        try {
            var h1 = new hummus.PDFRStreamForBuffer(array[0]);
            var pdfWriter = hummus.createWriterToModify(h1, new hummus.PDFStreamForResponse(outStream));
            array.shift()
            array.forEach(a1 => {
                var a1 = new hummus.PDFRStreamForBuffer(a1);
                pdfWriter.appendPDFPagesFromPDF(a1);
            })
            pdfWriter.end();
            var newBuffer = outStream.toBuffer();
            outStream.end();
            return newBuffer;
        }
        catch (e) {
            outStream.end();
            console.log('Error during PDF combination: ' + e.message);
        }
    };
    var result = await combinePDFBuffers([h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14]);
    return result;
}


app.post('/new2', async (req, res) => {
    try {
        const result = await main2(req.body.values);
        // Add Page Number using hummus
        var outStream = new memoryStreams.WritableStream();
        var pdfInserPageNumber = await hummus.createWriterToModify(new PDFRStreamForBuffer(result), new hummus.PDFStreamForResponse(outStream));
        const filePath1 = path.join(process.cwd(), `Poppins-Regular.ttf`)
        console.log(filePath1)
        var getFont = pdfInserPageNumber.getFontForFile(filePath1);
        var textOptions = { font: getFont, size: 10, colorspace: 'gray', color: 'black' };

        console.log(pdfInserPageNumber)
        var totalPages = await hummus.createReader(new PDFRStreamForBuffer(result)).getPagesCount()
        var pageNumber;
        for (pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
            if (pageNumber === 1) {
                console.log(' ')
            } else {
                var pageModifier = new hummus.PDFPageModifier(pdfInserPageNumber, pageNumber - 1, true);
                pageModifier.startContext().getContext().writeText(String(pageNumber), 520, 805, textOptions);
                pageModifier.endContext().writePage();
            }
        }
        pdfInserPageNumber.end();
        res.contentType("application/pdf");
        res.send(outStream.toBuffer())
    } catch (e) {
        console.log('error', e)
    }
})




app.listen(port, () => {
    console.log("listening on port", port);
    console.log(file1)
});

