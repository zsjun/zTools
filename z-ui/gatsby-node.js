const path = require('path');

exports.onCreateWebpackConfig = (args) => {
  console.log('111', path.resolve(__dirname, '../components/'));
  args.actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, '../src'), 'node_modules'],
      alias: {
        'z-ui/lib': path.resolve(__dirname, '../components/'),
        'z-ui/esm': path.resolve(__dirname, '../components/'),
        'z-ui': path.resolve(__dirname, '../components/'),
      },
    },
  });
};
