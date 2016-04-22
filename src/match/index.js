import replacer from '../replacer';
import { username } from '../user';
import config from '../config';

export default function match(file, resolve, reject) {
  let matched = false;
  const regExFileName = new RegExp(`^[\\W](${file.name})[\\W\\w]*`, 'gi');
  const regExFileEnding = new RegExp('.idlk', 'gi');

  if (file.extension !== config.stdFileEnding) {
    return reject(replacer(config.errors.fileTypeError, file));
  }

  if (config.rest) {
    if (file.user === username) {
      return resolve(file);
    }
  }

  file.folder.forEach((item) => {
    if (regExFileName.test(item) && regExFileEnding.test(item)) {
      matched = true;
    }
  });

  if (matched) {
    return reject(replacer(config.errors.matchError, file));
  }

  if (config.rest) {
    if (file.recentlyOpened) {
      return reject(replacer(config.errors.recentlyOpenedError, file));
    }
  }

  return resolve(file);
}
