import { app } from '../system';
import match from '../match';
import notify from '../notify';
import config from '../config';

export default function processFile(file) {
  match(file, (obj) => {
    app.open(obj.choosenFile);
    app.activate();

    if (config.rest) obj.changeUser();
  }, (err) => {
    notify(err);
  });
}
