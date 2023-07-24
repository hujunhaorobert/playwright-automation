import { type Locator, type Page } from '@playwright/test';
import BasePage from './basePage';

class AmpChargePage extends BasePage {
    readonly ampolEnergyIcon: Locator;
    
    constructor(page: Page, url: string = 'https://ampcharge.ampol.com.au') {
        super(page, url);
        this.ampolEnergyIcon = page.locator(".icon[src*='ampenergy']");
    }
};

export default AmpChargePage;