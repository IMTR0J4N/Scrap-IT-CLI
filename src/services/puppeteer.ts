import puppeteer from 'puppeteer';

export default class PuppeteerService {
    public async scrap(opt) {
        if (opt === 'html') {
            const browser = await puppeteer.launch();

            const page = await browser.newPage()

            page.on('response', async res => {
                if (res.request().resourceType() === 'stylesheet') {
                    let css = await res.text()


                }
            })
        }
    }
}