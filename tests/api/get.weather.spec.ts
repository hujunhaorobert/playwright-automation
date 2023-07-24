import { test, expect } from "@playwright/test";
import { XMLBuilder } from "fast-xml-parser";
import xmlFormat from "xml-formatter";
import { generateResponseFile } from "../../utils/generate.response.file";
import Ajv, { JSONSchemaType } from "ajv";
import dotenv from "dotenv";
dotenv.config();

const ajv = new Ajv();

interface GetWeatherResponse {
  location: {
    name: string
    region: string
    country: string
    lat: number
    lon: number
    tz_id: string
    localtime_epoch: number
    localtime: string
  },
  current: {
    last_updated_epoch: number,
    last_updated: string
    temp_c: number
    temp_f: number
    is_day: number
    condition: {
      text: string
      icon: string
      code: number
    },
    wind_mph: number
    wind_kph: number
    wind_degree: number
    wind_dir: string
    pressure_mb: number
    pressure_in: number
    precip_mm: number
    precip_in: number
    humidity: number 
    cloud: number
    feelslike_c: number
    feelslike_f: number
    vis_km: number
    vis_miles: number
    uv: number
    gust_mph: number
    gust_kph: number 
  }
};

const getWeatherResponseSchema: JSONSchemaType<GetWeatherResponse> = {
  "type": "object",
  "properties": {
    "location": {
      "type": "object",
      "properties": { "name": { "type": "string" },
        "region": { "type": "string" },
        "country": { "type": "string" },
        "lat": { "type": "number" },
        "lon": { "type": "number" },
        "tz_id": { "type": "string" },
        "localtime_epoch": { "type": "integer" },
        "localtime": { "type": "string" }
      },
      "required": [
        "name", "region", "country", "lat", "lon", "tz_id", "localtime_epoch", "localtime"
      ],
      additionalProperties: false
    },
    "current": {
      "type": "object",
      "properties": {
        "last_updated_epoch": { "type": "integer" },
        "last_updated": { "type": "string" },
        "temp_c": { "type": "integer" },
        "temp_f": { "type": "number" },
        "is_day": { "type": "integer" },
        "condition": { "type": "object",
          "properties": {
            "text": { "type": "string" },     
            "icon": { "type": "string" },
            "code": { "type": "integer" }
          },
          "required": [ "text",  "icon", "code" ],
          additionalProperties: false
        },
        "wind_mph": { "type": "number" },
        "wind_kph": { "type": "number" },
        "wind_degree": { "type": "number" },
        "wind_dir": { "type": "string" },
        "pressure_mb": { "type": "number" },
        "pressure_in": { "type": "number" },
        "precip_mm": { "type": "number" },
        "precip_in": { "type": "number" },
        "humidity": { "type": "number" },
        "cloud": { "type": "number" },
        "feelslike_c": { "type": "number" },
        "feelslike_f": { "type": "number" },
        "vis_km": { "type": "number" },
        "vis_miles": { "type": "number" },
        "uv": { "type": "number" },
        "gust_mph": { "type": "number" },
        "gust_kph": { "type": "number" }
      },
      "required": [ "last_updated_epoch", "last_updated", "temp_c", "temp_f", "is_day", "condition", "wind_mph", "wind_kph", "wind_degree", "wind_dir", "pressure_mb", "pressure_in", "precip_mm", "precip_in", "humidity", "cloud", "feelslike_c", "feelslike_f", "vis_km", "vis_miles", "uv", "gust_mph", "gust_kph" ],
      additionalProperties: false
    }
  },
  "required": [
    "location",
    "current"
  ],
  additionalProperties: false
};

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
    // console.log(
    //   `GET weather response JSON => \n${JSON.stringify(responseJson, null, 2)}`
    // );

    // validate is a type guard for Response data - type is inferred from getCardDetailsResponseSchema type
    const validate = ajv.compile(getWeatherResponseSchema);
    if (validate(responseJson)) {
      console.log("responseJson schema validation is successful");
      expect(responseJson.location.name).toEqual("Sydney");
      expect(responseJson.location.region).toEqual("New South Wales");
      expect(responseJson.location.country).toEqual("Australia");
      expect(responseJson.location.tz_id).toEqual("Australia/Sydney");
    } else {
        console.log(`Note: validate.errors =>`);
        console.log(validate.errors);
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
      })
      .build(toBeExportedWeatherDataJsonSchema);

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
      "/output",
      `${process.env.EXPORTED_WEATHER_XML_FILE_NAME}`
    );
  });
});