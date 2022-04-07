const puppeteer = require("puppeteer")
const express = require("express")

const errorConvertingHtmlToPdf = {"error": "Error converting html to pdf"}

async function printfPDF(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    })
    const page = await browser.newPage()

    await page.setContent(htmlContent)

    const pdf = await page.pdf({ format: "a4" })
    await browser.close()

    return pdf
}

const app = express()

app.get("/", async (req, res) => {
    const content = req.query["content"]

    printfPDF(content).then(pdf => {
        res.set({ "Content-Type": "application/pdf", "Content-Length": pdf.length })
        res.send(pdf)
    }).catch(err => {
        res.status(500).send(errorConvertingHtmlToPdf)
    })
})

app.listen(3000, () => console.log("Listening on port 3000"))