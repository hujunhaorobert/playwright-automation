import { type Locator, type Page } from '@playwright/test';
import BasePage from './basePage';

class AcsHomePage extends BasePage {
    readonly findOutMoreButton: Locator;
    readonly membershipApplicationUrl: string = 'https://www.acs.org.au/membership-application.html';
    readonly joinAcsUrl: string = 'https://www.acs.org.au/join-acs.html';
    readonly professionalRecognitionOption: Locator;
    readonly homeButton: Locator;

  

    constructor(readonly page: Page, readonly url: string = 'https://www.acs.org.au/') {
        super(page, url);
        this.findOutMoreButton = page.getByRole('link', { name: 'FIND OUT MORE ' });
        this.professionalRecognitionOption = page.getByRole('link', { name: '+ Professional Recognition' });
        this.homeButton = page.getByRole('link', { name: 'HOME ' });
    }

};

export default AcsHomePage;