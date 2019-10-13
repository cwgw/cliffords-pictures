const Bottleneck = require('bottleneck');
const chalk = require('chalk');
const sharp = require('sharp');
const request = require('request-promise');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const report = require('./reporter');

const rateLimiter = new Bottleneck({
  minTime: 3334, // 18 per minute
});

const round = (n, d = 10000) => Math.round(n * d) / d;

function createFaceID({ imageID, center: { x, y } }) {
  const [cx, cy] = [x, y].map(n => {
    let parts = n.toString().split('.');
    let v = parts.length > 1 ? parts[1] : parts[0];
    return v.padEnd(4, '0');
  });
  return `${imageID}-${cx}-${cy}`;
}

async function getImageStream(image, { rotation = 0, width, height }) {
  try {
    if (!(image instanceof sharp)) {
      image = await sharp(image);
    }
  } catch (err) {
    report(err);
  }

  return image
    .rotate(rotation)
    .resize(width, height)
    .jpeg()
    .toBuffer()
    .catch(report);
}

async function fetchFaces(image, { transform = {} } = {}) {
  console.log(chalk.gray('fetchFaces'));
  try {
    const scale = 0.5;
    const { width, height } = await image.metadata();

    const imageStream = await getImageStream(image, {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
      ...transform,
    });

    const requestOptions = {
      uri: 'https://westus2.api.cognitive.microsoft.com/face/v1.0/detect',
      qs: {
        returnFaceId: 'true',
        returnFaceLandmarks: 'false',
        returnFaceAttributes: 'age,gender',
      },
      method: 'POST',
      body: imageStream,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': process.env.OCP_APIM_SUBSCRIPTION_KEY,
      },
    };

    const responseBody = await rateLimiter.schedule(() =>
      request(requestOptions)
    );
    const responseData = JSON.parse(responseBody);

    const w = width / scale;
    const h = height / scale;

    return responseData.map(
      ({ faceId, faceRectangle: rect, faceAttributes: attributes }) => ({
        faceId,
        person: null,
        rect: {
          left: round(rect.left / w),
          top: round(rect.top / h),
          width: round(rect.width / w),
          height: round(rect.height / h),
          center: {
            x: round(rect.left / w + (rect.width / w) * 0.5),
            y: round(rect.top / h + (rect.height / h) * 0.5),
          },
        },
        attributes,
        imageTransform: transform.rotation % 360 === 0 ? null : transform,
      })
    );
  } catch (err) {
    report(err);
  }
}

async function getFaces(image) {
  console.log(chalk.gray('getFaces'));
  try {
    let faces = await fetchFaces(image);
    let transform = { rotation: 0 };
    while (faces.length < 1 && transform.rotation < 360) {
      transform.rotation += 90;
      faces = await fetchFaces(image, { transform });
    }

    transform = transform.rotation % 360 === 0 ? null : transform;

    return { faces, transform };
  } catch (err) {
    report(err);
  }
}

module.exports = exports = {
  createFaceID,
  getFaces,
};
