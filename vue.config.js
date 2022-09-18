const { defineConfig } = require("@vue/cli-service");
const { name } = require("./package");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    port: 9000,
  },
  configureWebpack: {
    output: {
      library: name,
      libraryTarget: "umd",
    },
  },
});
