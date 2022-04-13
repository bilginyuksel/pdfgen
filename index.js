const puppeteer = require("puppeteer")
const express = require("express")
const multer = require("multer")

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
        if (!req.body.html) {
            return res.status(400).send({"error": "HTML content is required"})
        }

        const html = req.body.html
        const options = req.body.options || { format: "a4" }

        return generateAndSendPDF(pdfGenerator, html, options, res)
    }
}

const generatePDFWithHTMLFile = (pdfGenerator) => {
    return (req, res) => {
        if (!req.file || !req.file.buffer) {
            return res.status(400).send({"error": "HTML file is required"})
        }

        const htmlFile = req.file.buffer.toString()
        const options = req.body.options || { format: "a4" }

        return generateAndSendPDF(pdfGenerator, htmlFile, options, res)
    }
}

const generateAndSendPDF = async (pdfGenerator, html, options, res) => {
    try {
        const pdf = await pdfGenerator.generate(html, options)
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Length", pdf.length)
        return res.send(pdf)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ "error": "PDF could not generated" })
    }
}

// initialization
const init = async () => {
    const app = express()
    const upload = multer()

    app.use(express.json())

    const browser = await createBrowser()
    const page = await browser.newPage()
    page.setJavaScriptEnabled(false)

    const pdfGenerator = new PDFGenerator(page)

    app.post("/", generatePDFWithHTMLContent(pdfGenerator))
    app.post("/upload", upload.single("file"), generatePDFWithHTMLFile(pdfGenerator))

    app.listen(3000, () => console.log("Listening on port 3000"))
}
init()
