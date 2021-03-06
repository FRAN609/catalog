// https://github.com/electron/electron-apps/blob/master/script/pack.js
const Queue = require('promise-queue');
const fs = require('fs-extra');
const imageSize = require('image-size');
const path = require('path');
const sharp = require('sharp');
const yaml = require('yamljs');
const { exec } = require('child_process');

const apps = [];
const appPath = path.join(__dirname, '../apps');
const distPath = path.join(__dirname, '../dist');

// Run concurrently to improve performance
const maxConcurrent = 20;
const maxQueue = Infinity;
const queue = new Queue(maxConcurrent, maxQueue);

const fixIconPyPath = path.join(__dirname, 'fixicon.py');

const fixIconAsync = (iconPath) => new Promise((resolve, reject) => {
  const size = imageSize(iconPath).width;
  const pad = Math.round((size / 512) * 20); // need to find a better formula

  exec(`python3 ${fixIconPyPath} ${iconPath} ${size} ${pad}`, (e, stdout, stderr) => {
    if (e instanceof Error) {
      reject(e);
      return;
    }

    // eslint-disable-next-line no-console
    console.log(stdout);

    resolve({ stdout, stderr });
  });
});


fs.readdirSync(appPath)
  .filter((filename) => fs.statSync(path.join(appPath, filename)).isDirectory())
  .forEach((slug) => {
    const yamlFile = path.join(appPath, `${slug}/${slug}.yml`);
    const s3Url = process.env.APP_ID === 'singlebox' ? 'https://s3.singleboxapp.com' : 'https://s3.getwebcatalog.com';
    const app = {
      id: slug,
      objectID: slug,
      ...yaml.load(yamlFile),
      icon: `${s3Url}/apps/${slug}/${slug}-icon.png`,
      icon128: `${s3Url}/apps/${slug}/${slug}-icon-128.png`,
    };

    const iconName = process.env.APP_ID === 'singlebox' ? `${slug}-icon-filled.png` : `${slug}-icon.png`;
    const iconFile = path.join(appPath, slug, iconName);
    const copiedIconFile = path.join(distPath, `${slug}/${slug}-icon.png`);

    fs.copySync(iconFile, copiedIconFile);

    queue.add(() => Promise.resolve()
      .then(() => {
        if (process.env.APP_ID === 'singlebox') return null;
        return fixIconAsync(copiedIconFile);
      })
      .then(() => sharp(copiedIconFile)
        .resize(128, 128)
        .toFile(path.join(distPath, `${slug}/${slug}-icon-128.png`)))
      .catch((e) => {
        // eslint-disable-next-line
        console.log(e);
        process.exit(1);
      }));

    apps.push(app);
  });

fs.ensureDirSync(distPath);

fs.writeFileSync(
  path.join(distPath, 'index.json'),
  JSON.stringify(apps, null, 2),
);
