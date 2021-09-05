
/**
 * @type {import('webpack').Configuration}
*/

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    { loader: 'babel-loader' }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: [
                    // { loader: 'babel-loader' },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true         // 设置后 当ts 出错的类型错误的时候 不会影响 webpack 打包
                        }
                    }
                ],
                exclude: /node_modules/,
            }
        ]
    }
}