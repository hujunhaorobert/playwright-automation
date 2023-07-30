import { test, expect } from "@playwright/test";
import { XMLBuilder } from "fast-xml-parser";
import xmlFormat from "xml-formatter";
import { generateResponseFile } from "../../utils/generate.response.file";
import { GetWeatherResponse } from "../../models/types/getWeatherResponse";
import { CONSTANTS } from "../../config/constants";
import Ajv, { JSONSchemaType } from "ajv";
import fs from "fs";
import dotenv from "dotenv";
import { showError, showInfo } from "../../utils";
dotenv.config();

const ajv = new Ajv();

const getWeatherResponseSchema: JSONSchemaType<GetWeatherResponse> = JSON.parse(
  fs.readFileSync(
    `${process.cwd()}/models/schema/get.weather.response.schema.json`,
    "utf-8"
  )
);

test.describe("Part1: API Test", async () => {
  test("User Get current weather details and export XML file sydney-weather.xml", async ({
    request,
  }) => {
    const getWeatherResponse = await request.get(`/v1/current.json`, {
      params: {
        key: `${process.env.WEATHER_API_KEY}`,
        q: "sydney",
        aqi: "no",
      },
    });
    expect(getWeatherResponse.status()).toBe(200);
    expect(getWeatherResponse.ok()).toBeTruthy();
    const responseJson = await getWeatherResponse.json();
    showInfo(`GET weather response JSON => \n${JSON.stringify(responseJson, null, 2)}`);

    // validate is a type guard for Response data - type is inferred from getCardDetailsResponseSchema type
    const validate = ajv.compile(getWeatherResponseSchema);
    if (validate(responseJson)) {
      console.log("responseJson schema validation is successful");
      expect(responseJson.location.name).toEqual("Sydney");
      expect(responseJson.location.region).toEqual("New South Wales");
      expect(responseJson.location.country).toEqual("Australia");
      expect(responseJson.location.tz_id).toEqual("Australia/Sydney");
    } else {
      showError(`${JSON.stringify(validate.errors)}`);
    }

    const toBeExportedWeatherDataJsonSchema = {
      Location: {
        Name: responseJson.location.name,
        Region: responseJson.location.region,
        Country: responseJson.location.country,
        tz_id: responseJson.location.tz_id,
      },
      Current: {
        Condition: {
          Text: responseJson.current.condition.text,
        },
        Humidity: responseJson.current.humidity,
        uv: responseJson.current.uv.toFixed(1),
      },
    };

    const weatherDataXML = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
    }).build(toBeExportedWeatherDataJsonSchema);

    const xmlHeader = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`;
    const xmlXSD = `<ase:aseXML xmlns:ase="urn:aseXML:r41" 
                      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                      xsi:schemaLocation="urn:aseXML:r41 
                      http://www.nemmco.com.au/aseXML/schemas/r41/aseXML_r41.xsd">
                      ${weatherDataXML} 
                    </ase:aseXML>`;
    const weatherXML = `${xmlHeader} ${xmlXSD}`;

    // Write the XML to file under folder: output/sydney-weather.xml
    // collapseContent: True to keep content in the same line as the element. Default to false
    await generateResponseFile(
      xmlFormat(weatherXML, { collapseContent: true }),
      CONSTANTS.OUTPUT_DATA_FOLDER,
      CONSTANTS.EXPORTED_WEATHER_XML_FILE_NAME
    );
  });
});
