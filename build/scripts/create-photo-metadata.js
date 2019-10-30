const axios = require('axios');
const Bottleneck = require('bottleneck');
const fs = require('fs-extra');
const path = require('path');
const round = require('lodash/round');
const sharp = require('sharp');

require('dotenv').config({
  path: `.env.build`,
});

const faceApi = axios.create({
  baseURL: 'https://westus2.api.cognitive.microsoft.com/face/v1.0/detect',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': process.env.OCP_APIM_SUBSCRIPTION_KEY,
  },
  params: {
    returnFaceId: 'true',
    returnFaceLandmarks: 'false',
    returnFaceAttributes: 'age,gender',
  },
});

const rateLimiter = new Bottleneck({
  minTime: 3334, // 18 per minute
});

module.exports = async function createMetada({
  file,
  config: { dest },
  reporter,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const imagePipeline = await sharp(file.filePath);
      const aspectRatio = await getAspectRatio({ imagePipeline });
      const metadata = {
        id: file.name,
        aspectRatio,
        people: null,
        date: null,
        location: null,
      };
      await Promise.all([
        getBase64({ imagePipeline }).then(base64 => {
          metadata.base64 = base64;
        }),
        getFaces({ metadata, imagePipeline, reporter }).then(
          ({ faces, transform }) => {
            metadata.faces = faces;
            metadata.transform = transform;
          }
        ),
      ]);
      return resolve(
        fs.writeJSON(
          path.resolve(dest.metadata, `${file.name}.json`),
          metadata,
          { spaces: 2 }
        )
      );
    } catch (err) {
      reporter.panic('Could not create metadata.', err);
    }
  });
};

async function getAspectRatio({ imagePipeline }) {
  return imagePipeline.metadata().then(({ width, height }) => width / height);
}

function getBase64({ imagePipeline }) {
  return imagePipeline
    .clone()
    .resize({ width: 16 })
    .blur(1.5)
    .png({ force: true })
    .toBuffer()
    .then(buffer => `data:image/png;base64,${buffer.toString(`base64`)}`);
}

async function getFaces({ metadata, imagePipeline, reporter }) {
  const { id, aspectRatio } = metadata;
  let width = 1536;
  let height = Math.round(width / aspectRatio);
  let rotate;
  let faces = [];
  let i = 0;
  const progress = reporter.createProgress(`${id} create metadata`, 4, 0);
  progress.start();

  do {
    rotate = i * 90;
    try {
      // swap width and height with each rotation (after the first)
      if (i) {
        [width, height] = [height, width];
      }
      faces = await imagePipeline
        .clone()
        .rotate(rotate)
        .resize(width, height)
        .jpeg({ quality: 85, force: true })
        .toBuffer()
        .then(stream =>
          rateLimiter.schedule(() =>
            faceApi
              .post('', stream)
              .then(response => response.data)
              .catch(err => reporter.panic('Face API request failed.', err))
          )
        );
      progress.tick();
    } catch (err) {
      reporter.panic('Could not complete request.', err);
    }
  } while (faces.length < 1 && ++i < 4);

  faces = faces.map(
    ({ faceId, faceRectangle: r, faceAttributes: attributes }) => {
      const rect = {
        top: round(r.top / height, 8),
        left: round(r.left / width, 8),
        width: round(r.width / width, 8),
        height: round(r.height / height, 8),
      };
      rect.center = {
        x: round(rect.left + rect.width / 2, 8),
        y: round(rect.top + rect.height / 2, 8),
      };
      return {
        id: createFaceID({ imageId: id, center: rect.center }),
        faceId,
        attributes,
        rect,
      };
    }
  );

  progress.done();

  return {
    faces,
    transform: faces.length && rotate % 360 ? { rotate } : null,
  };
}

function createFaceID({ imageId, center: { x, y } }) {
  const [cx, cy] = [x, y].map(n =>
    round(n * 100)
      .toString()
      .padStart(2, '0')
  );
  return `${imageId}-${cx}-${cy}`;
}
