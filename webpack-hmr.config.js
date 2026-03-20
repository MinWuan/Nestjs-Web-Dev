const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

module.exports = (options, webpack) => ({
  ...options,
  devtool: 'inline-source-map', // Kích hoạt source map cho gỡ lỗi dễ dàng hơn

  entry: ['webpack/hot/poll?100', options.entry], // Thêm mô-đun HMR vào điểm nhập

  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'], // Đảm bảo rằng mô-đun HMR được bao gồm trong gói
    }),
  ],

  resolve: {
    ...options.resolve,
    extensions: [...(options.resolve?.extensions || []), '.ts', '.js'], // Thêm phần mở rộng tệp TypeScript nếu cần
    // alias: {
    //   ...(options.resolve?.alias || {}),
    //   '@': path.resolve(__dirname, 'src'),
    //   '@modules': path.resolve(__dirname, 'src/modules'),
    // },
    plugins: [
      ...(options.resolve?.plugins || []),
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
  },

  plugins: [
    ...options.plugins,

    new webpack.HotModuleReplacementPlugin(), // Kích hoạt plugin HMR

    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/],
    }), // Giúp bỏ qua các tệp đã biên dịch khi theo dõi thay đổi

    new RunScriptWebpackPlugin({
      name: options.output.filename,
      autoRestart: false,
    }), // Tự động khởi động lại ứng dụng khi có thay đổi
  ],
});
