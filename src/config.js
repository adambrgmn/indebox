/**
 * CONFIG
 * Change according to your needs
 * More info at https://github.com/adambrgmn/indebox#readme
 */
const config = {
  stdApp: 'Adobe InDesign CC 2015',
  dropboxName: 'Dropbox',
  stdPath: 'path/to/default/folder',
  stdFileTypes: ['dyn.ah62d4rv4ge80w5xequ'],
  stdFileEndings: 'indd',
  rest: false,
  restUrl: '',
  errors: {
    fileTypeError: {
      title: 'An error occured',
      message: 'The filetype "[extension]" is not supported',
    },
    matchError: {
      title: 'InDeBox',
      subtitle: 'The file is used by [user]',
      message: '[name].[extension] is used',
    },
    recentlyOpenedError: {
      title: 'InDeBox',
      subtitle: 'The file was opened by [user]',
      message: '[name].[extension] was opened just a few seconds ago',
    },
  },
};

/**
 * Use this if-statment to make special changes to config
 * during development. Maybe you don't have InDesign installed
 * on your computer but want to test it anyway.
 */
if (process.env.NODE_ENV !== 'production') {
  config.stdApp = 'Adobe InDesign CC 2015';
}

export default config;
