#!/usr/bin/env node
import WeatherService from '../WeatherService.js';

// http-клиент на встроенном fetch, интерфейс совместим с axios
const httpClient = {
  get: async (url) => {
    const response = await fetch(url);
    return { data: await response.json() };
  },
};

const city = process.argv[2];
const service = new WeatherService(httpClient);
const { temperature } = await service.getWeather(city);
console.log(`Temperature in ${city}: ${temperature}C`);
