// zip.ts
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json');

const { version } = packageJson;
const zipsDir = 'zips';

const getUniqueZipFileName = (baseName, counter = 0) => {
  const suffix = counter === 0 ? '' : `(${counter})`;
  const fileName = `${baseName}${suffix}.zip`;
  const filePath = path.join(zipsDir, fileName);

  if (fs.existsSync(filePath)) {
    return getUniqueZipFileName(baseName, counter + 1);
  }
  return fileName;
};

const baseZipFileName = `zippyziggy-v${version}`;
const zipFileName = getUniqueZipFileName(baseZipFileName);

if (!fs.existsSync(zipsDir)) {
  fs.mkdirSync(zipsDir);
}

const output = fs.createWriteStream(path.join(zipsDir, zipFileName));
const archive = archiver('zip', {
  zlib: { level: 9 },
});

output.on('close', () => {
  console.log(`${zipFileName} 파일이 생성되었습니다: ${archive.pointer()} total bytes`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory('dist', false);
archive.finalize();
