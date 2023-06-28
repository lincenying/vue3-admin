/*
 * @Author: luoxi
 * @Date: 2022-01-25 09:51:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-21 22:57:42
 * @FilePath: \vue-admin-box\vite.config.ts
 * @Description:
 */
import { resolve } from 'node:path'
import type { ConfigEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

import Components from './vite.config.components'

function pathResolve(dir: string): any {
    return resolve(__dirname, '.', dir)
}

const alias: Record<string, string> = {
    '@': pathResolve('src'),
}

/**
 * @description-en vite document address
 * @description-cn vite官网
 * https://vitejs.cn/config/ */
export default ({ command }: ConfigEnv): UserConfigExport => {
    const prodMock = true
    return {
        base: './',
        resolve: {
            alias,
        },
        server: {
            port: 3001,
            host: '0.0.0.0',
            open: true,
            proxy: { // 代理配置
                '/dev': 'https://www.fastmock.site/mock/48cab8545e64d93ff9ba66a87ad04f6b/',
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        echarts: ['echarts'],
                    },
                },
            },
        },
        plugins: [
            vue(),
            viteMockServe({
                mockPath: 'mock',
                localEnabled: command === 'serve',
                prodEnabled: command !== 'serve' && prodMock,
                watchFiles: true,
                injectCode: `
                    import { setupProdMockServer } from '../mockProdServer';
                    setupProdMockServer();
                `,
                logger: true,
            }),
            ...Components(),
        ],
        css: {
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === 'charset')
                                    atRule.remove()
                            },
                        },
                    },
                ],
            },
        },
    }
}
