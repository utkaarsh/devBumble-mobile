module.exports = function (api) {
  api.cache(true); // 👈 This enables Babel caching

  return {
    presets: ["babel-preset-expo", "nativewind/babel"],
    plugins: [
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
          importSource: "nativewind",
        },
        "react-native-reanimated/plugin",
      ],
    ],
  };
};
