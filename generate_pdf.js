const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'CareerNest_Project_Report.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait a moment for fonts to load
  await new Promise(r => setTimeout(r, 2000));

  await page.pdf({
    path: path.resolve(__dirname, 'CareerNest_Project_Report.pdf'),
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,   // ← removes date/time header and URL footer
    margin: {
      top:    '2cm',
      right:  '2.2cm',
      bottom: '2cm',
      left:   '2.8cm'
    }
  });

  const pdfStats = require('fs').statSync(path.resolve(__dirname, 'CareerNest_Project_Report.pdf'));
  console.log(`✅ PDF generated successfully!`);
  console.log(`   Size: ${(pdfStats.size / 1024).toFixed(0)} KB`);
  console.log(`   Path: CareerNest_Project_Report.pdf`);

  await browser.close();
})();
