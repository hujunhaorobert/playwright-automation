import { test } from "@playwright/test";
import AcsHomePage from "../../pages/acs.home.page";
import { CONSTANTS } from "../../config/constants";
import dotenv from "dotenv";
import { showInfo } from "../../utils";
dotenv.config();

test.describe("Visit ACS home page", async () => {
  test("Scenario A: Login ACS home page", async ({ page }) => {
    const acsHomePage = new AcsHomePage(page);
    // const ampChargePage = new AmpChargePage(page);
    // const energyPage = new EnergyPage(page);
    // const energySignUpPage = new EnergySignUpPage(page);

    // Visit ampolHomePage
    await acsHomePage.goto();
    await acsHomePage.verifyPageUrl();
    await acsHomePage.findOutMoreButton.click();
    await acsHomePage.verifyPageUrl(acsHomePage.joinAcsUrl);

    // await acsHomePage.waitForPageDomcontentLoaded();
    // // await page.goto('https://www.acs.org.au/membership-application.html');
    // await acsHomePage.professionalRecognitionOption.click();
    // await acsHomePage.homeButton.click();
  });

  
});
