const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index-local-test.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  mode: "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "dev-bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/index-local-test.html"),
          to: path.resolve(__dirname, "build/index.html"),
        },
        {
          from: path.resolve(__dirname, "src/manifest.json"),
          to: path.resolve(__dirname, "build"),
        },
        {
          from: path.resolve(__dirname, "src/scatter-plot-3d.json"),
          to: path.resolve(__dirname, "build"),
        },
        {
          from: path.resolve(__dirname, "src/scatter-plot-3d.css"),
          to: path.resolve(__dirname, "build"),
        },
        {
          from: path.resolve(
            __dirname,
            "src/three-chart/fonts/*.typeface.json"
          ),
          to: path.resolve(__dirname, "build/fonts/[name][ext]"),
        },
      ],
    }),
  ],
};
