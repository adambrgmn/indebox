import File from './File';
import processFile from './process-file';

/**
 * Function that is called when the app is clicked.
 */
window.run = () => {
  const file = new File();
  processFile(file);
};

/**
 * Function that is called if a file/files is dropped upon
 * the app, or if a file/files is clicked and opened with
 * the app.
 * @param  {File}  docs  The documents dropped or opened
 */
window.openDocuments = (docs) => {
  for (const item of docs) {
    const file = new File(item);
    processFile(file);
  }
};
