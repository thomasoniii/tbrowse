module.exports = {
  entry:  './wrapper.js',
  output: {
    libraryTarget: 'var',
    library: 'launchTBrowse',
    path:     __dirname + '/build',
    filename: 'tbrowse.js',
  },
  module: {
    loaders: [
      {
        test:   /\.js/,
        loader: 'babel-loader',
        include: __dirname,
      }
    ],
  },
};