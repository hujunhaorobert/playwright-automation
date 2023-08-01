### Playwright Automation Test Framework For Web APP & API Testing


### How to get started
    1. Git clone the repo
    2. Go to playwright-automation folder
    3. Install node, npm (or yarn) if not done yet, but not mix using npm or yarn
    4. Install all dependencies by CLI
        npm install


### How to run UI test on different browser engine(chromium | webkit | firefox) locally
  
    1. Run the UI test on chromium
       npm run test:chromium
    2. Run the UI test on webkit
       npm run test:webkit
    3. Run the UI test on firefox
       npm run test:firefox

### How to run API test locally
    Please set WEATHER_API_KEY in {{project-root-folder}}\.env firstly
    npm run test:api

### How to run all test cases locally
    Please refer to api test and set .env firstly
    npm run test:all  

    
### How to check HTML test report locally
    Normally the test will generate html report finally, to open the test report in the last run:
      
        npx playwright show-report

    Test output data is stored under output:

        1. sydney-weather.xml - created by API test
        2. post-api-ampolenergy-onboarding-v1-lead-response.json, created by UI test Scenario B

    Test videos or screenshots will be generated and persisted under videos or screenshot folder during the test run.
    These data will be cleaned up beforehand when rerun the test(s) via above CLIs.

### CI Pipeline, test report & test artifacts archive, test result notification
    CircleCI has been setup for this GitHub project. When a new git commit is pushed and merged, it will trigger workflow:

       1. The run-test-and-notify job will be started automatically
       2. Test report will be generated and all test artifacts will be uploaded
       3. Test result notification will be sent to Slack and mobile phone via SMS
       
<img width="600" alt="Screenshot 2023-07-27 at 5 43 35 pm" src="https://github.com/hujunhaorobert/playwright-automation/assets/10079887/be4157f0-a665-4d4e-a1d5-896bb52dad1e">
<img width="410" alt="Screenshot 2023-07-27 at 5 36 05 pm" src="https://github.com/hujunhaorobert/playwright-automation/assets/10079887/e80ffc82-7fe4-4b66-9808-f753fa6591c4">
<img width="180" alt="Screenshot 2023-07-29 at 12 53 18 pm" src="https://github.com/hujunhaorobert/playwright-automation/assets/10079887/ad4b31a7-2b28-41a4-8b2c-5f952fc77a0a">
