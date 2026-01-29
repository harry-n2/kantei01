const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const htmlPath = path.join(__dirname, 'slides.html').replace(/\\/g, '/');
    await page.goto(`file:///${htmlPath}`, { waitUntil: 'networkidle0' });

    // 標準的なプレゼンサイズ
    await page.setViewport({ width: 1280, height: 720 });

    const totalSlides = 12;
    const pdfPages = [];

    for (let i = 1; i <= totalSlides; i++) {
        await page.evaluate((slideNum) => {
            document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
            document.querySelector(`[data-slide="${slideNum}"]`).classList.add('active');
            const nav = document.querySelector('.nav');
            const counter = document.querySelector('.slide-counter');
            const progress = document.querySelector('.progress');
            if (nav) nav.style.display = 'none';
            if (counter) counter.style.display = 'none';
            if (progress) progress.style.display = 'none';
        }, i);

        await delay(500);

        const pdfBuffer = await page.pdf({
            landscape: true,
            format: 'A4',
            printBackground: true,
            scale: 1
        });
        pdfPages.push(pdfBuffer);
        console.log(`Slide ${i} captured`);
    }

    const mergedPdf = await PDFDocument.create();

    for (const pdfBuffer of pdfPages) {
        const pdf = await PDFDocument.load(pdfBuffer);
        const [copiedPage] = await mergedPdf.copyPages(pdf, [0]);
        mergedPdf.addPage(copiedPage);
    }

    const outputPath = path.join(__dirname, 'presentation.pdf');
    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedPdfBytes);

    console.log('PDF generated:', outputPath);
    await browser.close();
})();
