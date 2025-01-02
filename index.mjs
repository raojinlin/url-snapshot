import process from 'process';
import puppeteer from 'puppeteer';

const url = process.argv[2];
if (!url) {
  throw new Error('url required.');
}

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
});
const page = await browser.newPage();


const normaledUrl = (url) => {
  return url.replace(/(?:http|https):\/\//, '').replace(/\./g, '_').replace(/\//g, '-');
};

await page.goto(url, {
  waitUntil: 'networkidle2'
});

// Set screen size.
await page.setViewport({width: 1470, height: 956});

await page.screenshot({
  path: normaledUrl(url) + '.png',
  fullPage: true,
});


await browser.close();
