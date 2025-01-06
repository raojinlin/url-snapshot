import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import snapshot from './app/lib/snapshot.js';
import winston from 'winston';
import crypto from 'crypto';
import fs from 'fs';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({points: 3, duration: 1});

const devicesContent = fs.readFileSync('./src/emulateDevices.json', 'utf8');
const devices = JSON.parse(devicesContent);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

const app = new Koa();
const router = new Router();

const cacheDir = process.env.CACHE_DIR || '/tmp/url-snapshot';
const metaDir = cacheDir + '/meta';

if (!fs.existsSync(metaDir)) {
  fs.mkdirSync(metaDir);
}

const buildeSnapshotOption = ctx => {
  return {
    full: ctx.query.full === 'true',
    toBase64: ctx.query.toBase64 === 'true',
    width: ctx.query.width ? parseInt(ctx.query.width) : undefined,
    height: ctx.query.height ? parseInt(ctx.query.height) : undefined,
    userAgent: devices.find(device => device.title === ctx.query.device)?.['user-agent'],
  }
}


router.get('/api/snapshot', async ctx => {
  if (!ctx.query.url) {
    ctx.status = 400;
    ctx.body = 'url is required';
    return;
  }

  logger.info(`Snapshot taken for ${ctx.query.url}`);
  ctx.set('Content-Type', 'image/png');

  const option = buildeSnapshotOption(ctx);
  const urlDigest = crypto.createHash('md5').update(ctx.query.url + JSON.stringify(option)).digest('hex');
  const cahcedImage = cacheDir + '/' + urlDigest + '.png';
  // Check cache first
  if (fs.existsSync(cahcedImage)) {
    logger.info(`Snapshot cache hit for ${ctx.query.url}`);
    ctx.body = fs.createReadStream(cahcedImage);
    return;
  }

  // Take snapshot for the url
  const image = await snapshot(decodeURIComponent(ctx.query.url), option);
  logger.info(`Snapshot complete for ${ctx.query.url}`);

  // Cache the snapshot
  fs.writeFileSync(cahcedImage, image);
  logger.info(`Snapshot cached for ${ctx.query.url}`);

  // Cache the snapshot meta
  fs.writeFileSync(metaDir + '/' + urlDigest, JSON.stringify({url: ctx.query.url, createdAt: new Date(), option}));
  logger.info(`Snapshot meta cached for ${ctx.query.url}`);

  ctx.body = Buffer.alloc(image.length, image);
})

app.use(router.routes());
app.use(serve('build'));

app.use(async (ctx, next) => {
  try {
    await rateLimiter.consume(ctx.ip);
    await next();
  } catch (e) {
    ctx.status = 429;
    ctx.body = 'Too many requests';
  }
})

logger.info('Server listend: 0.0.0.0:30001')
app.listen(3001);
