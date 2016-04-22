import { join } from 'path';
import { currentApp } from '../system';
import { dropboxDir, homeDir } from '../user';
import exists from '../exists';
import config from '../config';

let defaultLocation;
const stdPath = join(dropboxDir, config.stdPath);

if (exists(stdPath)) {
  defaultLocation = stdPath;
} else if (exists(dropboxDir)) {
  defaultLocation = dropboxDir;
} else {
  defaultLocation = homeDir;
}

export default function chooseFile() {
  const file = currentApp.chooseFile({
    withPrompt: 'Choose file',
    ofType: config.stdFileTypes,
    defaultLocation,
  });

  return file;
}
