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
curl "localhost:3000?content=%3Ch1%3EHello%20from%20pdfgen%3C%2Fh1%3E" -o sample.pdf

open sample.pdf
```
