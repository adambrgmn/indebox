import { app } from '../system';
import match from '../match';
import notify from '../notify';
import config from '../config';

export default function processFile(file) {
  match(file, (item) => {
    app.open(item.choosenFile);
    app.activate();

    if (config.rest) item.changeUser();
  }, (err) => {
    notify(err);
  });
}
