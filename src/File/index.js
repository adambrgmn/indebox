import { systemEvents } from '../system';
import { changeFileUser, fileData } from '../api';
import chooseFile from '../chooseFile';
import config from '../config';

export default class File {
  constructor(item) {
    this._choosenFile = !item ? chooseFile() : item;
    this._alias = systemEvents.aliases.byName(this._choosenFile.toString());
    this._fileData = config.rest ? fileData(this.name) : null;
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
    return this._alias.container().posixPath();
  }

  get folder() {
    return systemEvents.folders.byName(this.path).diskItems.name();
  }

  get extension() {
    return this._alias.nameExtension();
  }

  get user() {
    if (this._fileData) {
      return this._fileData.username;
    }

    return null;
  }

  get recentlyOpened() {
    if (this._fileData) {
      const lastOpened = this._fileData.date;
      const now = Date.now();
      const timeFromNow = now - lastOpened;

      return timeFromNow < 10000;
    }

    return null;
  }

  changeUser() {
    changeFileUser(this.name);
  }
}
