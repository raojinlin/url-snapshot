import puppeteer from 'puppeteer';

// Normalize url to filename.
  const normalizeURL = (url) => {
    const parsedUrl = new URL(url);
    return (parsedUrl.hostname + parsedUrl.pathname)
      .replace(/(?:http|https):\/\//, '')
      .replace(/\./g, '_')
      .replace(/\//g, '-');
  };

const snapshot = async (url, option={full: true, toBase64: false, width: 1470, height: 956, userAgent: ''}) => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage();

  if (option.userAgent) {
    await page.setUserAgent(option.userAgent)
  }

  await page.goto(url, {
    waitUntil: 'networkidle2'
  }, {
  });

  // Set screen size.
  await page.setViewport({width: option.width || 1470, height: option.height || 956});

  const image = await page.screenshot({
    // path: normalizeURL(url) + '.png',
    fullPage: option.full,
    encoding: option.toBase64 ? 'base64' : 'binary',
  });


  await browser.close();
  return image;
}


export default snapshot;
