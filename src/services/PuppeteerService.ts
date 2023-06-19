import puppeteer from 'puppeteer';
import prettify = require('html-prettify');
import FileService from './FileService';
import { HTMLScrapOpt } from '../types';

export default class PuppeteerService {

    public async scrap(url: string, savePath: string, fileType: string, opt?: HTMLScrapOpt) {

        const folder = url.split('/')[2].split('.')[0]

        if (fileType === 'html') {
            const browser = await puppeteer.launch({ headless: "new" });

            const page = await browser.newPage()

            await page.goto(url)

            page.on('response', async res => {
                await FileService.checkPathOrCreate(`${savePath}/Scrap-IT`)
                await FileService.checkPathOrCreate(`${savePath}/Scrap-IT/${folder}`)

                if (opt?.includeStyle && res.request().resourceType() === 'stylesheet') {

                    const css = await res.text()

                    await FileService.checkPathOrCreate(`${savePath}/Scrap-IT/${folder}/css/`)

                    await FileService.writeDataInFile(`${savePath}/Scrap-IT/${folder}/css/style.css`, css)
                }

                if (opt?.includeStyle && res.request().resourceType() === "script") {

                    const js = await res.text()

                    await FileService.checkPathOrCreate(`${savePath}/Scrap-IT/${folder}/js/`)

                    await FileService.writeDataInFile(`${savePath}/Scrap-IT/${folder}/js/app.js`, js)

                }



                await FileService.writeDataInFile(`${savePath}/Scrap-IT/${folder}/index.html`, prettify(await page.evaluate(() => document.documentElement.outerHTML)))
            })
        }
    }
}