export default class WeatherService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async getWeather(city) {
    const response = await this.httpClient.get(
      `http://localhost:8080/api/v2/cities/${city}`,
    );
    return response.data;
  }
}
