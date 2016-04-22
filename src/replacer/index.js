import { forEach } from 'lodash';
import config from '../config';

function replaceString(str, file) {
  const newString = str
    .replace(/\[name\]/, file.name)
    .replace(/\[extension\]/, file.extension);

  if (config.rest) {
    return newString.replace(/\[user\]/, file.user);
  }

  return newString;
}

export default function replacer(obj, file) {
  const newObj = obj;

  forEach(newObj, (val, key) => {
    newObj[key] = replaceString(val, file);
  });

  return newObj;
}
