import { test, chromium } from "@playwright/test";
import HomePage from "../../pages/home.page";
import AmpChargePage from "../../pages/ampcharge.page";
import EnergyPage from "../../pages/energy.page";
import EnergySignUpPage from "../../pages/energy.signup.page";
import { generateResponseFile } from "../../utils/generate.response.file";
import dotenv from "dotenv";
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
    // ampChargePage seems a Javascript-heavy sites, add waitForLoadState & status attached to avoid flaky test result
    await ampChargePage.waitForPageDomcontentLoaded();
    await ampChargePage.ampolEnergyIcon.waitFor({ state: "attached" });
    await ampChargePage.ampolEnergyIcon.click();

    // Page jumps to energyPage
    // energyPage seems a Javascript-heavy sites, add waitForLoadState & status attached to avoid flaky test result
    await energyPage.verifyPageUrl();
    await energyPage.waitForPageDomcontentLoaded();
    await energyPage.switchNowButton.waitFor({ state: "attached" });
    await energyPage.switchNowButton.click();

    // Page jumps to energySignUpPage
    await energySignUpPage.waitForPageDomcontentLoaded();
    await energySignUpPage.verifyPageUrl();
    await energySignUpPage.enterSuburbOrPostCodeEditor.isVisible();
  });

  test("Optional/Bonus - Scenario B: Sign Up on energy page and intercept network request, export response to a .json file", async () => {
    const browser = await chromium.launch({
      headless: process.env.CI ? true : false,
      slowMo: 200,
    });
    const context = await browser.newContext({
      recordVideo: {
        dir: "videos/",
        size: { width: 800, height: 600 },
      },
    });
    const page = await context.newPage();

    const energySignUpPage = new EnergySignUpPage(page);

    // Page jumps to energySignUpPage
    const interceptUrl = `${process.env.INTERCEPTED_POST_REQUEST_URL}`;
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
        console.log(`<<-Intercepted POST Response json body\n${JSON.stringify(json, null, 2)}`);
        // Write the network response to a JSON file
        await generateResponseFile(
          JSON.stringify(json, null, 2),
          "/output",
          `${process.env.EXPORTED_RESPONSE_JSON_FILE_NAME}`
        );

        leadId = json.leadId;
        console.log(`in Route, leadId = ${leadId}`);
        // Fulfill using the original response
        await route.fulfill({ response, json });
      }
    );

    const responsePromise = energySignUpPage.waitForNetworkResponse(interceptUrl);
    await energySignUpPage.viewPlanButton.click();
    const response = await responsePromise;

    console.log(`Intercepted response.json() => ${JSON.stringify(await response.json(), null, 2)}`);
    console.log(`leadId = ${leadId}`);

    const finalUrl = `https://energy.ampol.com.au/sign-up/agent?leadid=${leadId}`;
    console.log(`finalUrl = ${finalUrl}`);

    await energySignUpPage.goto(finalUrl);
    await energySignUpPage.waitForPageDomcontentLoaded();

    await page.screenshot({ path: "screenshot/signUp.png" });

    await context.close();
    await browser.close();
  });
});
