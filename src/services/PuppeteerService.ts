import puppeteer, { Browser } from 'puppeteer';
import prettify = require('html-prettify');
import FileService from './FileService';
import { HTMLScrapOpt } from '../types';
import { log } from 'console';

export default class PuppeteerService {

    public async scrap(url: string, savePath: string, fileType: string, opt?: HTMLScrapOpt) {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage()
        await page.goto(url)

        const folder = url.split('/')[2].split('.')[0]

        if (fileType === 'html') {


            page.once('response', async (res) => {
                await FileService.checkPathOrCreate(`${savePath}/Scrap-IT`)
                await FileService.checkPathOrCreate(`${savePath}/Scrap-IT/${folder}`)


                if (opt?.includeScript) {

                    await page.evaluate(async () => {
                        const scripts = document.querySelectorAll('script');

                        for (const script of scripts) {
                            if (script.src) {
                                if (script.src.includes(document.location.href) && await this.isUrl(script.src)) {
                                    await this.scrapJs(browser, script.src, savePath, folder)
                                } else if (!script.src.includes(document.location.href)) {
                                    script.src = `${document.location.href}${script.src}`
                                    await this.scrapJs(browser, script.src, savePath, folder)
                                } else if (await this.isUrl(script.src)) {
                                    await this.scrapJs(browser, script.src, savePath, folder)
                                }
                            } else if (script.outerText) {
                                await FileService.checkPathOrCreate(`${savePath}/Scrap-IT/${folder}/js/`)

                                await FileService.writeDataInFile(`${savePath}/Scrap-IT/${folder}/js/app.js`, script.outerText)
                            }

                            script.remove()
                        }

                        const newScript = document.createElement('script');
                        newScript.src = "./js/app.js"

                        document.body.appendChild(newScript);
                    })

                }

                if (opt?.includeStyle) {
                    await page.evaluate(async () => {
                        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
                        const styles = document.querySelectorAll('style')
                        for (const stylesheet of stylesheets) {

                            let linkHref = stylesheet.getAttribute('href')

                            if (linkHref) {
                                if (linkHref.includes(document.location.href) && await this.isUrl(linkHref)) {
                                    await this.scrapCss(browser, linkHref, savePath, folder)
                                } else if (!linkHref.includes(document.location.href)) {
                                    linkHref = `${document.location.href}${linkHref}`
                                    await this.scrapCss(browser, linkHref, savePath, folder)
                                }
                            }

                            stylesheet.remove()
                        }

                        for (const style of styles) {
                            await FileService.checkPathOrCreate(`${savePath}/Scrap-IT/${folder}/css/`)

                            await FileService.writeDataInFile(`${savePath}/Scrap-IT/${folder}/css/style.css`, style.outerText)

                            style.remove()
                        }

                        const newStyle = document.createElement('link');
                        newStyle.rel = "stylesheet";
                        newStyle.href = "./css/style.css"

                        document.body.appendChild(newStyle);
                    })
                }



                await FileService.writeDataInFile(`${savePath}/Scrap-IT/${folder}/index.html`, prettify(await page.content()))
            })
        }
    }

    private async scrapJs(browser: Browser, url: string, savePath: string, folder: string) {
        const page = await browser.newPage()

        await page.goto(url)

        page.on('response', async (res) => {
            const js = await res.text()

            await FileService.checkPathOrCreate(`${savePath}/Scrap-IT/${folder}/js/`)

            await FileService.writeDataInFile(`${savePath}/Scrap-IT/${folder}/js/app.js`, js)
        })
    }

    private async scrapCss(browser: Browser, url: string, savePath: string, folder: string) {
        const page = await browser.newPage()

        await page.goto(url)

        page.on('response', async (res) => {
            const css = await res.text()

            await FileService.checkPathOrCreate(`${savePath}/Scrap-IT/${folder}/css/`)

            await FileService.writeDataInFile(`${savePath}/Scrap-IT/${folder}/css/style.css`, css)
        })
    }

    private async isUrl(url: string): Promise<boolean> {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(url);
    }
}