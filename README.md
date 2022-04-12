# pdfgen

Simple html to pdf application. Takes the html input converts it to pdf.

## Getting Started

Build docker image

```bash
docker build -t pdfgen .
```

Run docker image
```bash
docker run -dit -p 3000:3000 pdfgen
```

## Usage

After you run the docker image you can use it easily like.

```bash
curl --location --request POST http://localhost:3000 --header 'Content-Type: application/json' --data-raw '{"html": "<h1>Hello world</h1>"}' -o sample.pdf

open sample.pdf
```
