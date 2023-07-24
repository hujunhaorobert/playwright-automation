import { type Locator, type Page } from '@playwright/test';
import BasePage from './basePage';

class EnergyPage extends BasePage {
    readonly switchNowButton: Locator;

    constructor(readonly page: Page, readonly url: string = 'https://energy.ampol.com.au/') {
        super(page, url);    
        this.switchNowButton = page.getByTestId('Hero').getByTestId('Button');
    }
};

export default EnergyPage;