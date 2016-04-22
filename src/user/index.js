import { join } from 'path';
import { systemEvents } from '../system';
import config from '../config';

export const homeDir = systemEvents.currentUser().homeDirectory();
export const dropboxDir = join(homeDir, config.dropboxName);
export const username = systemEvents.currentUser().fullName();
