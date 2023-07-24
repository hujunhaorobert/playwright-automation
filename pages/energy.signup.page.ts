import { type Locator, type Page } from '@playwright/test';
import BasePage from './basePage';

class EnergySignUpPage extends BasePage {
    readonly enterSuburbOrPostCodeEditor: Locator;
    readonly clayField4011QldOption: Locator;
    readonly viewPlanButton: Locator;

    constructor(readonly page: Page, readonly url: string = 'https://energy.ampol.com.au/sign-up/postcode') {
        super(page, url);    
        // this.enterSuburbOrPostCodeEditor = page.getByPlaceholder("Enter suburb or postcode");
        this.enterSuburbOrPostCodeEditor = page.getByTestId('postcode-input');
        // this.clayField4011QldOption =  page.getByRole('option', { name: `Clayfield 4011 QLD`, exact: true });
        this.clayField4011QldOption =  page.getByTestId('postcode-option-0').locator('div').nth(1);
        this.viewPlanButton =  page.getByTestId('Button');
    }
};

export default EnergySignUpPage;