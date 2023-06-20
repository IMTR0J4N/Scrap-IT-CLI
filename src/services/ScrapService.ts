import axios from 'axios';
import * as HTMLParser from 'node-html-parser'
import prettify = require('html-prettify');
import FileService from './FileService';
import { HTMLScrapOpt } from '../types';
import { log } from 'console';

export default class ScrapService {

    public async scrapURL(url: string, savePath: string, fileType: string, opt?: HTMLScrapOpt) {

        const folder = url.split('/')[2].split('.')[0]

        if (opt?.includeScript && opt?.includeStyle) {
            FileService.setupTemplate(savePath, { template: "html-css-js" }, folder)
            
            const scrapDocument = await this.getHtml(url)
            
            const scrapJsFiles = scrapDocument.querySelectorAll("script")

            const scrapJs = await this.getJs(scrapJsFiles)

            await FileService.writeDataInFile(`${savePath}\\Scrap-IT\\${folder}\\index.html`, scrapDocument.outerHTML)
        } else if (opt?.includeScript && !opt?.includeStyle) {
            FileService.setupTemplate(savePath, { template: 'html-js' }, folder)
        } else if (opt?.includeStyle && !opt?.includeScript) {
            FileService.setupTemplate(savePath, { template: 'html-css'}, folder)
        } else if (!opt?.includeScript && !opt?.includeStyle) {
            FileService.setupTemplate(savePath, { template: 'html'}, folder)
        }
    }

    private async getHtml(url: string): Promise<HTMLParser.HTMLElement> {
        const axiosRes = HTMLParser.parse((await axios.get(url, { responseType: "document" })).data)

        return axiosRes
    }

    private async getJs(jsFiles: HTMLParser.HTMLElement[]) {
        for (const js of jsFiles) {
       }
    }

    private async getCss(url: string) {
    
    }

    private async isUrl(url: string): Promise<boolean> {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(url);
    }
}