import { join } from 'path';
import { currentApp, systemEvents, finder, dropboxDir } from '../utils';
import { changeFileUser, getFileUser, fileRecentlyOpened } from '../user';
import config from 'config';

export default class File {
  constructor(item) {
    if (!item) {
      let defaultLocation = join(dropboxDir, config.stdPath);
      const pathExists = finder.exists(Path(defaultLocation));
      defaultLocation = pathExists ? defaultLocation : dropboxDir;

      this._choosenFile = currentApp.chooseFile({
        withPrompt: 'Choose file',
        ofType: config.stdFileTypes,
        defaultLocation,
      });
    } else {
      this._choosenFile = item;
    }

    this._alias = systemEvents.aliases.byName(this._choosenFile.toString());
  }

  get choosenFile() {
    return this._choosenFile;
  }

  get name() {
    const filename = this._alias.name().split('.');
    filename.pop();
    return filename.join();
  }

  get path() {
    return systemEvents.folders.byName(this.path).diskItems.name();
  }

  get extension() {
    return this._alias.nameExtension();
  }

  get user() {
    return getFileUser(this.name);
  }

  get recentlyOpened() {
    return fileRecentlyOpened(this.name);
  }

  changeUser() {
    changeFileUser(this.name);
  }
}
