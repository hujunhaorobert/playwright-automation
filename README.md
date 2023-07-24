### Playwright Automation Test Framework For Web APP & API Testing


### How to get started
    1. Git clone the repo
   
    2. Go to playwright-automation folder

    3. Install npm (or yarn) if not done yet, but not mix using npm or yarn

    4. Install all dependencies by CLI
   
        npm install


### How to run UI test on different browser engine(chromium | webkit | firefox)
  
    1. Run the UI test on chromium
   
       npm run test:chromium
  
    2. Run the UI test on webkit
   
       npm run test:webkit

    3. Run the UI test on firefox
   
       npm run test:firefox

### How to run API test

    npm run test:api

### How to run all test cases
   
    npm run test:all  

    
### How to check HTML test report
    Normally the test will generate html report finally, to open the test report in the last run:
      
        npx playwright show-report

    Test output data is under **output**:

        1. sydney-weather.xml - created by API test
        2. post-api-ampolenergy-onboarding-v1-lead-response.json, created by UI test Scenario B

    Test videos or screenshots will be generated and persisted under videos or screenshot folder during the test run. They will be cleaned up before rerun the test CLI.
