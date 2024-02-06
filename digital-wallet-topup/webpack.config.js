// const path = require('path');

// module.exports = {
//     entry: './handler.js',
//     target: 'node',
//     mode: 'production',
//     resolve: {
//         extensions: ['.js'],
//     },
//     output: {
//         libraryTarget: 'commonjs2',
//         path: path.join(__dirname, '.webpack'),
//         filename: 'handler.js',
//     },
// };
const path = require('path');

module.exports = {
    entry: {
        getUserInfo: './src/getUserInfo.js',
        getTransactionDetails: './src/getTransactionDetails.js',
        updateWallet: './src/updateWallet.js'
    },
    
    target: 'node',
    mode: 'production',
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        // filename: 'src/getUserInfo.js',
        filename: 'src/[name].js',
    },
};
