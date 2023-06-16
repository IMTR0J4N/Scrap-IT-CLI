import { ScrapFiles } from "../interfaces"
import { HTMLScrapOpts, PDFScrapOpts, PNGScrapOpts } from "../types"

const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin())

export default class PuppeteerService {

    public async scrap(fileType: string, opt?: HTMLScrapOpts | PNGScrapOpts | PDFScrapOpts) {
        if (fileType === "html") {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage()

            await page.goto('https://bot.sannysoft.com')
            await page.waitForTimeout(5000)
            await page.screenshot({ path: 'stealth.png', fullPage: true })            
        }
    }
}