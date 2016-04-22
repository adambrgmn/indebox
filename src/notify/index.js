import { currentApp } from '../system';

export default function notify(obj) {
  currentApp.displayNotification(obj.message, {
    withTitle: obj.title || 'Message',
    subtitle: obj.subtitle || '',
  });
}
