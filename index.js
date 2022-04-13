const puppeteer = require("puppeteer")
const express = require("express")
const multer = require("multer")

const createBrowser = async () => {
    return await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    })
}

const createBlankPage = async (browser) => {
    const page = await browser.newPage()
    page.setJavaScriptEnabled(true)
    return page
}

const generatePDF = async (page, html, options) => {
    await page.setContent(html)
    return await page.pdf(options)
}

const generatePDFWithHTMLContent = (page) => {
    return (req, res) => {
        if (!req.body.html) {
            return res.status(400).send({ "error": "HTML content is required" })
        }
        const options = req.body.options || { format: "a4" }
        return generateAndSendPDF(page, req.body.html, options, res)
    }
}

const generatePDFWithHTMLFile = (page) => {
    return (req, res) => {
        if (!req.file || !req.file.buffer) {
            return res.status(400).send({ "error": "HTML file is required" })
        }
        const options = req.body.options || { format: "a4" }
        return generateAndSendPDF(page, req.file.buffer.toString(), options, res)
    }
}

const generateAndSendPDF = async (page, html, options, res) => {
    try {
        const pdf = await generatePDF(page, html, options)
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
    const page = await createBlankPage(browser)

    app.post("/", generatePDFWithHTMLContent(page))
    app.post("/upload", upload.single("file"), generatePDFWithHTMLFile(page))

    app.listen(3000, () => console.log("Listening on port 3000"))
}
init()
    .then(() => console.log("Application started"))
    .catch(console.error)
