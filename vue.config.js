const {defineConfig} = require('@vue/cli-service')


module.exports = defineConfig({
    transpileDependencies: true,
    // publicPath: './',
    devServer: {
        allowedHosts: [
            'https://whales-are-awesome.github.io',
        ]
    },
    chainWebpack: config => {
    },
    configureWebpack: (config) => {
        config.plugins = [
            ...config.plugins,
        ];
        config.resolve.fallback = {
            ...config.resolve.fallback,
        };
    }
})
