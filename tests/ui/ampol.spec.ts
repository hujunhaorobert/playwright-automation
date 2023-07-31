import { test } from "@playwright/test";
import HomePage from "../../pages/home.page";
import AmpChargePage from "../../pages/ampcharge.page";
import EnergyPage from "../../pages/energy.page";
import EnergySignUpPage from "../../pages/energy.signup.page";
import { generateResponseFile } from "../../utils/generate.response.file";
import { CONSTANTS } from "../../config/constants";
import dotenv from "dotenv";
import { showInfo } from "../../utils";
dotenv.config();

test.describe("Part 2: UI test", async () => {
  test("Scenario A: Login Ampol home page, user journey of page jumping -> ampcharge -> energy -> sign up ", async ({ page }) => {
    const ampolHomePage = new HomePage(page);
    const ampChargePage = new AmpChargePage(page);
    const energyPage = new EnergyPage(page);
    const energySignUpPage = new EnergySignUpPage(page);

    // Visit ampolHomePage
    await ampolHomePage.goto();
    await ampolHomePage.verifyPageUrl();
    await ampolHomePage.yourVehicleMenu.hover();
    await ampolHomePage.evChargingOption.click();

    // Page jumps to ampChargePage
    await ampChargePage.verifyPageUrl();
    // ampChargePage seems a Javascript-heavy sites, add waitForLoadState & state attached to avoid flaky test result
    await ampChargePage.waitForPageDomcontentLoaded();
    await ampChargePage.waitForElementStateAttached(ampChargePage.ampolEnergyIcon);
    await ampChargePage.ampolEnergyIcon.click();

    // Page jumps to energyPage
    // energyPage seems a Javascript-heavy sites, add waitForLoadState & state attached to avoid flaky test result
    await energyPage.waitForURL();
    await energyPage.verifyPageUrl();
    await energyPage.waitForPageDomcontentLoaded();
    await energyPage.waitForElementStateAttached(energyPage.switchNowButton);
    await energyPage.switchNowButton.click();

    // Page jumps to energySignUpPage
    await energySignUpPage.waitForPageDomcontentLoaded();
    await energySignUpPage.verifyPageUrl();
    await energySignUpPage.enterSuburbOrPostCodeEditor.isVisible();
  });

  test("Optional/Bonus - Scenario B: Sign Up on energy page and intercept network request, export response to a .json file", async ({ page }) => {
    const energySignUpPage = new EnergySignUpPage(page);
    // Page jumps to energySignUpPage
    const interceptUrl = CONSTANTS.INTERCEPTED_POST_REQUEST_URL;
    await energySignUpPage.goto();
    await energySignUpPage.verifyPageUrl();
    await energySignUpPage.enterSuburbOrPostCodeEditor.fill("4011");
    await energySignUpPage.clayField4011QldOption.click();
    energySignUpPage.interceptNetworkRequest(interceptUrl, "POST");

    let leadId = "";
    await page.route(
      interceptUrl,
      async (route) => {
        const response = await route.fetch();

        const json = await response.json();
        showInfo(`<<-Intercepted POST Response json body\n${JSON.stringify(json, null, 2)}`);
        // Write the network response to a JSON file
        await generateResponseFile(
          JSON.stringify(json, null, 2),
          CONSTANTS.OUTPUT_DATA_FOLDER,
          CONSTANTS.EXPORTED_RESPONSE_JSON_FILE_NAME
        );
        leadId = json.leadId;
        showInfo(`in Route, leadId = ${leadId}`);
        // Fulfill using the original response
        await route.fulfill({ response, json });
      }
    );

    const responsePromise = energySignUpPage.waitForNetworkResponse(interceptUrl);
    await energySignUpPage.viewPlanButton.click();
    const response = await responsePromise;
    showInfo(`Intercepted response.status() => ${JSON.stringify(await response.status(), null, 2)}`);
    showInfo(`Intercepted response.headers() => ${JSON.stringify(await response.headers(), null, 2)}`);
    // showInfo(`Intercepted response.json() => ${JSON.stringify(await response.json(), null, 2)}`);
    showInfo(`leadId = ${leadId}`);

    const finalUrl = `https://energy.ampol.com.au/sign-up/agent?leadid=${leadId}`;
    showInfo(`finalUrl = ${finalUrl}`);
    await energySignUpPage.goto(finalUrl);
    await energySignUpPage.waitForPageDomcontentLoaded();
    await page.screenshot({ path: "screenshot/signUp.png" });

  });
});
