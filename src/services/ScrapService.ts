import axios from 'axios';
import * as HTMLParser from 'node-html-parser'
import prettify = require('html-prettify');
import FileService from './FileService';
import { HTMLScrapOpt, StylesTagObj } from '../types';
import { log } from 'console';

export default class ScrapService {

    public async scrapURL(url: string, savePath: string, fileType: string, opt?: HTMLScrapOpt) {

        const folder = url.split('/')[2].split('.')[0]

        if (opt?.includeScript && opt?.includeStyle) {

            FileService.setupTemplate(savePath, { template: "html-css-js" }, folder)
            
            const scrapDocument = await this.scrapAndWriteHtml(url, savePath, folder)
            
            const scrapJsFiles = scrapDocument.querySelectorAll("script")
            const stylesTag = scrapDocument.querySelectorAll('style')
            const linkStyleTag = scrapDocument.querySelectorAll('link[rel="stylesheet"]')

            const stylesObj: StylesTagObj = {
                stylesTag,
                linkStyleTag
            }

            await this.scrapAndWriteJs(scrapJsFiles, url, savePath, folder, scrapDocument)
            await this.scrapAndWriteCss(stylesObj, url, savePath, folder, scrapDocument)

        } else if (opt?.includeScript && !opt?.includeStyle) {
            FileService.setupTemplate(savePath, { template: 'html-js' }, folder)

            const scrapDocument = await this.scrapAndWriteHtml(url, savePath, folder)

            const scrapJsFiles = scrapDocument.querySelectorAll("script")

            await this.scrapAndWriteJs(scrapJsFiles, url, savePath, folder, scrapDocument)
        } else if (opt?.includeStyle && !opt?.includeScript) {
            FileService.setupTemplate(savePath, { template: 'html-css' }, folder)
            
            const scrapDocument = await this.scrapAndWriteHtml(url, savePath, folder)

            const stylesTag = scrapDocument.querySelectorAll('style')
            const linkStyleTag = scrapDocument.querySelectorAll('link[rel="stylesheet"]')

            const stylesObj: StylesTagObj = {
                stylesTag,
                linkStyleTag
            }

            await this.scrapAndWriteCss(stylesObj, url, savePath, folder, scrapDocument)
        } else if (!opt?.includeScript && !opt?.includeStyle) {
            FileService.setupTemplate(savePath, { template: 'html' }, folder)
            
            const scrapDocument = await this.scrapAndWriteHtml(url, savePath, folder)
        }
    }

    private async scrapAndWriteHtml(url: string, savePath: string, folder: string): Promise<HTMLParser.HTMLElement> {
        const axiosRes = HTMLParser.parse((await axios.get(url, { responseType: "document" })).data)

        await FileService.writeDataInFile(`${savePath}${folder}\\index.html`, axiosRes.outerHTML)

        return axiosRes
    }

    private async scrapAndWriteJs(jsFiles: HTMLParser.HTMLElement[], url: string, savePath: string, folder: string, scrapDocument: HTMLParser.HTMLElement) {
        let res = "";
        for (const js of jsFiles) {
            let jsSrc = js.getAttribute('src');

            if (jsSrc && await this.isUrl(jsSrc)) {
                res += (await axios.get(jsSrc)).data
            } else if (js.innerText !== "") {
                res += js.innerText
            } else if (jsSrc && !await this.isUrl(jsSrc) && js.innerText === "") {
                jsSrc = `${url}${jsSrc}`

                res += (await axios.get(jsSrc)).data
            } else {
                js.remove()
                return
            }
            js.remove()
        }
        await FileService.writeDataInFile(`${savePath}${folder}\\src\\js\\app.js`, res)

        const body = scrapDocument.querySelector('body');
        body?.appendChild(HTMLParser.parse(`<script src="./src/js/app.js">`))
        
    }

    private async scrapAndWriteCss(stylesObj: StylesTagObj, url: string, savePath: string, folder: string, scrapDocument: HTMLParser.HTMLElement) {
        let styleRes = "";
        let linkRes = "";
        for (const styleTag of stylesObj.stylesTag) {
            if (styleTag.innerText !== "") {
                styleRes = styleTag.innerText
                styleTag.remove()
            } else {
                styleTag.remove()
            }
        }

        for (const linkTag of stylesObj.linkStyleTag) {
            let linkHref = linkTag.getAttribute('href');
            if (linkHref && await this.isUrl(linkHref)) {
                linkRes = (await axios.get(linkHref)).data
            } else if (linkHref && !await this.isUrl(linkHref)) {
                linkHref = `${url}${linkHref}`
                linkRes = (await axios.get(linkHref)).data
            } else {
                linkTag.remove()
                return
            }
            linkTag.remove()
        }

        await FileService.writeDataInFile(`${savePath}${folder}\\src\\css\\style.css`, linkRes)
        await FileService.appendDataInFile(`${savePath}${folder}\\src\\css\\style.css`, styleRes)

        const head = scrapDocument.querySelector('head');
        head?.appendChild(HTMLParser.parse(`<link rel="stylesheet" href="./src/css/style.css">`))
    }

    private async isUrl(url: string): Promise<boolean> {
        const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
        return urlRegex.test(url);
    }
}