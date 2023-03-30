const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
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
  mode: "production",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "scatter-plot-3d.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
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
