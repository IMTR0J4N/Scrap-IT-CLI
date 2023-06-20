import axios from 'axios';
import prettify = require('html-prettify');
import FileService from './FileService';
import { HTMLScrapOpt } from '../types';

export default class ScrapService {

    public async scrapURL(url: string, savePath: string, fileType: string, opt?: HTMLScrapOpt) {

        const folder = url.split('/')[2].split('.')[0]

        if (opt?.includeScript && opt?.includeStyle) {
            FileService.setupTemplate(savePath, { template: "html-css-js"}, folder)
        } else if (opt?.includeScript && !opt?.includeStyle) {
            FileService.setupTemplate(savePath, { template: 'html-js' }, folder)
        } else if (opt?.includeStyle && !opt?.includeScript) {
            FileService.setupTemplate(savePath, { template: 'html-css'}, folder)
        } else if (!opt?.includeScript && !opt?.includeStyle) {
            FileService.setupTemplate(savePath, { template: 'html'}, folder)
        }

        this.getHtml(url, savePath, folder)
        
    }

    private async getHtml(url: string, savePath: string, folder: string) {
        const axiosRes = await axios.get(url, { responseType: "document" })
       await FileService.writeDataInFile(`${savePath}\\Scrap-IT\\${folder}\\index.html`, axiosRes.data)
    }

    private async getJs(url: string, savePath: string, folder: string) {
       
    }

    private async getCss(url: string, savePath: string, folder: string) {
    
    }

    private async isUrl(url: string): Promise<boolean> {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(url);
    }
}