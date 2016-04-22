import config from '../config';

export const app = Application(config.stdApp);
export const systemEvents = Application('System Events');
export const finder = Application('Finder');
export const currentApp = Application.currentApplication();
currentApp.includeStandardAdditions = true;
