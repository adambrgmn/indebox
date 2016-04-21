const ConcatSource = require('webpack-core/lib/ConcatSource');

function JxaPlugin() {
  this.banner = 'const window = this;';
  this.footer = `function run(args) {
    if (window.run) {
      window.run(args);
    }
  }
  function openDocuments(docs) {
    if (window.openDocuments) {
      window.openDocuments(docs)
    }
  }`;
}

JxaPlugin.prototype.apply = function apply(compiler) {
  const banner = this.banner;
  const footer = this.footer;

  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
      chunks.forEach((chunk) => {
        chunk.files.forEach((file) => {
          compilation.assets[file] = new ConcatSource(
            banner,
            '\n\n',
            compilation.assets[file],
            '\n\n',
            footer
          );
        });
      });
      callback();
    });
  });
};

module.exports = JxaPlugin;
