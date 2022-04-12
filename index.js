const puppeteer = require("puppeteer")
const express = require("express")

class PDFGenerator {
    constructor(page) {
        this.page = page
    }

    async generate(html, options = { format: "a4" }) {
        await this.page.setContent(html)
        return await this.page.pdf(options)
    }
}

async function createBrowser() {
    return await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    })
}

const generatePDFWithHTMLContent = (pdfGenerator) => {
    return (req, res) => {
        const html = req.body.html
        const options = req.body.options || { format: "a4" }

        return generateAndSendPDF(pdfGenerator, html, options, res)
    }
}

const generatePDFWithHTMLFile = (pdfGenerator) => {
    return (req, res) => {
        const htmlFile = req.body.htmlFile
        const options = req.body.options || { format: "a4" }

        return generateAndSendPDF(pdfGenerator, htmlFile, options, res)
    }
}

const generateAndSendPDF = (pdfGenerator, html, options, res) => {
    pdfGenerator.generate(html, options)
        .then(pdf => {
            res.setHeader("Content-Type", "application/pdf")
            res.setHeader("Content-Length", pdf.length)
            res.send(pdf)
        }).catch(err => {
            console.error(err)
            res.status(500).send(err)
        })
}

// initialization
const init = async () => {
    const app = express()

    app.use(express.json())

    const browser = await createBrowser()
    const page = await browser.newPage()
    page.setJavaScriptEnabled(false)

    const pdfGenerator = new PDFGenerator(page)

    app.post("/", generatePDFWithHTMLContent(pdfGenerator))
    app.post("/pdf", generatePDFWithHTMLFile(pdfGenerator))

    app.listen(3000, () => console.log("Listening on port 3000"))
}
init()