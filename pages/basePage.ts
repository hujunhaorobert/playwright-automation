import { expect, Locator, type Page } from '@playwright/test';

abstract class BasePage {
    constructor(readonly page: Page, readonly url: string) {
        this.page = page;
        this.url = url;
    }

    public async goto(url:string = this.url) {
        console.log(`Go to ${this.constructor.name} with url=${url}`);
        await this.page.goto(url);
    }

    public async waitForPageDomcontentLoaded() {
        await this.page.waitForLoadState('domcontentloaded');
    }
    
    public async verifyPageUrl() {
        console.log(`Validate ${this.constructor.name} Url is: ${this.url}`);
        await expect(this.page).toHaveURL(this.url);
    }
    
    public async assertWebElementToBeVisible(elementLocator: Locator) {
        await expect(elementLocator).toBeVisible();
    }
    
    public async assertWebElementToBeHidden(elementLocator: Locator) {
        await expect(elementLocator).toBeHidden();
    }
    
    public async assertWebElementToBeEnabled(elementLocator: Locator) {
        await expect(elementLocator).toBeEnabled();
    }
    
    public async assertWebElementToBeDisabled(elementLocator: Locator) {
        await expect(elementLocator).toBeDisabled();
    }
    
    public async scrollDownScreen() {
        await this.page.evaluate(this.scroll, {direction: "down", speed: "slow"});
    }
    
    public async scrollUpScreen() {
        await this.page.evaluate(this.scroll, {direction: "up", speed: "fast"});
    }

    public async scroll (args) {
        const {direction, speed} = args;
        console.log(args);
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const scrollHeight = () => document.body.scrollHeight;
        const start = direction === "down" ? 0 : scrollHeight();
        const shouldStop = (position) => direction === "down" ? position > scrollHeight() : position < 0;
        const increment = direction === "down" ? 100 : -100;
        const delayTime = speed === "slow" ? 50 : 10;
        console.error(start, shouldStop(start), increment)
        for (let i = start; !shouldStop(i); i += increment) {
            window.scrollTo(0, i);
            await delay(delayTime);
        }
    };

    public async waitForNetworkResponse (targetUrl: string): Promise<any> {
        const responsePromise = await this.page.waitForResponse(targetUrl);
        return responsePromise;
    }

    public interceptNetworkRequest (targetUrl: string, method: string): void {
        this.page.on('request', req => {
            if ( req.url() === targetUrl && req.method() === method ) {
              console.log(`->> : ${req.method()} ${req.resourceType()} ${req.url()} ${JSON.stringify(req.headers(), null, 2)}`);
        }});
    }
};

export default BasePage;