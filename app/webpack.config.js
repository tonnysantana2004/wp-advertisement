const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');
const glob = require('glob');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

const resourcesFolder = 'resources';

// Remove .asset.php outside the folder "blocks/"
class RemoveUnwantedAssetFiles {

    apply(compiler) {
        compiler.hooks.emit.tapAsync('RemoveUnwantedAssetFiles', (compilation, callback) => {
            Object.keys(compilation.assets).forEach((filename) => {
                if (filename.endsWith('.asset.php') && !filename.includes('blocks/')) {
                    delete compilation.assets[filename];
                }
            });
            callback();
        });
    }
}

let blockEntries = typeof defaultConfig.entry === 'function'
    ? defaultConfig.entry()
    : defaultConfig.entry;

// Auto-discover all JS and SCSS inside the resources folder
const patterns = [
    { pattern: './' + resourcesFolder + '/**/*.scss', ext: '.scss' },
    { pattern: './' + resourcesFolder + '/**/*.css', ext: '.css' },
    { pattern: './' + resourcesFolder + '/**/*.webp', ext: '.webp' },
    { pattern: './' + resourcesFolder + '/**/*.js', ext: '.js' },
]

const customEntries = {};
patterns.forEach(({ pattern, ext }) => {
    glob.sync(pattern, {
        ignore: [
            './' + resourcesFolder + '/**/blocks/**',
            '**/_*.scss',
        ],
    }).forEach((file) => {
        let relative = path
            .relative(path.resolve(__dirname, resourcesFolder), file)
            .replace(/\\/g, '/')
            .replace(ext, '');

        relative = relative.replace("scss/", 'css/');

        customEntries[relative] = path.resolve(__dirname, file);
    });
});

module.exports = {

    entry: {
        ...blockEntries,
        ...customEntries,
    },

    output: {
        filename: () => '[name].js',
        clean: true,
    },

    plugins: [
        ...defaultConfig.plugins.filter(
            (plugin) =>
                plugin.constructor.name !== 'RtlCssPlugin' && // remove rtl support
                plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        ),
        new DependencyExtractionWebpackPlugin(),
        new RemoveUnwantedAssetFiles(),
        new RemoveEmptyScriptsPlugin({
            stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
        }),
    ],

    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            {
                test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: (pathData) => {
                        const relativePath = path
                            .relative(path.resolve(__dirname, resourcesFolder), pathData.filename)
                            .replace(/\\/g, '/');
                        return relativePath;
                    },
                },
            },
        ],
    },
};