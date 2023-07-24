import { type Locator, type Page } from '@playwright/test';
import BasePage from './basePage';

class HomePage extends BasePage {
    readonly yourVehicleMenu: Locator;
    readonly evChargingOption: Locator;

    constructor(readonly page: Page, readonly url: string = 'https://www.ampol.com.au/') {
        super(page, url);
        this.yourVehicleMenu = page.getByText(/Your Vehicle/i).first();
        // this.yourVehicleMenu = page.getByText("Your Vehicle").first();
        this.evChargingOption = page.getByRole('link', { name: 'EV Charging', exact: true });
    }

};

export default HomePage;