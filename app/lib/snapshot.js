import puppeteer from 'puppeteer';

// Normalize url to filename.
  const normalizeURL = (url) => {
    const parsedUrl = new URL(url);
    return (parsedUrl.hostname + parsedUrl.pathname)
      .replace(/(?:http|https):\/\//, '')
      .replace(/\./g, '_')
      .replace(/\//g, '-');
  };

const snapshot = async (url, toBase64=false) => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2'
  });

  // Set screen size.
  await page.setViewport({width: 1470, height: 956});

  const image = await page.screenshot({
    path: normalizeURL(url) + '.png',
    fullPage: true,
    encoding: toBase64 ? 'base64' : 'binary',
  });


  await browser.close();
  return image;
}


export default snapshot;