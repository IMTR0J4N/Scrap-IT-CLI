import puppeteer from 'puppeteer';
import prettify = require('html-prettify');
import FileService from './FileService';

export default class PuppeteerService {

    public async scrap(url: string, savePath: string, fileType: string, opt?: ScrapOpts) {
        if (fileType === 'html') {
            const browser = await puppeteer.launch();

            const page = await browser.newPage()

            page.goto(url)

            page.on('response', async res => {
                FileService.isFolderExist(`${savePath}/Scrap-IT/`)

                if (opt?.includeStyle && res.request().resourceType() === 'stylesheet') {

                    const css = await res.text()

                    FileService.isFolderExist(`${savePath}/Scrap-IT/css/`)

                    FileService.writeDataInFile(`${savePath}/Scrap-IT/css/style.css`, css)
                }

                if (opt?.includeStyle && res.request().resourceType() === "script") {

                    const js = await res.text()

                    FileService.isFolderExist(`${savePath}/Scrap-IT/js/`)

                    FileService.writeDataInFile(`${savePath}/Scrap-IT/js/app.js`, js)

                }

                FileService.writeDataInFile(`${savePath}/Scrap-IT/index.html`, prettify(await page.evaluate(() => document.documentElement.outerHTML)))
            
            })
        }
    }
}
