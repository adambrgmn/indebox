import { join } from 'path';
import { currentApp } from '../system';
import { username } from '../user';
import config from '../config';

function curl(filename, params) {
  let put;
  const url = join(config.restUrl, 'fileuser', `${filename}.json`);

  if (params) {
    put = `-X PUT -d '${JSON.stringify(params)}'`;
  }

  const shellScript = `curl ${put} '${url}'`;

  try {
    return currentApp.doShellScript(shellScript);
  } catch (err) {
    return false;
  }
}

export function changeFileUser(filename) {
  const params = {
    date: Date.now(),
    username,
  };

  return curl(filename, params);
}

export function fileData(filename) {
  return curl(filename);
}
