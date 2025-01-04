// Import npm packages
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apiKey = "3a849e27b67890f2f624e909070224f1"; // Consider storing sensitive data in environment variables

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Middleware to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Utility to fetch weather and location data
async function getWeatherData(lat, lon) {
  const locationResponse = await axios.get(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
  );

  const locationData = locationResponse.data[0];
  if (!locationData) throw new Error("Location data not found");

  const cityName = locationData.name;
  const weatherResponse = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`
  );

  return weatherResponse.data;
}

app.get(
    "/",
    asyncHandler(async (req, res) => {
      const lat = 51.6533; // Example coordinates for London
      const lon = -3.2844;
      try {
        const weatherData = await getWeatherData(lat, lon);
        const currentWeather = {
          city: weatherData.city.name,
          temp: Math.floor(weatherData.list[0].main.temp) + "°",
          description: weatherData.list[0].weather[0].description,
          humidity: Math.floor(weatherData.list[0].main.humidity),
          feels_like: Math.floor(weatherData.list[0].main.feels_like),
          temp_min: Math.floor(weatherData.list[0].main.temp_min) + "°",
          temp_max: Math.floor(weatherData.list[0].main.temp_max) + "°",
        };
        const forecastData = {};
  
        weatherData.list.forEach((item) => {
          const date = item.dt_txt.split(" ")[0];
          if (!forecastData[date]) {
            forecastData[date] = {
              day_today: new Date(date).toLocaleDateString("en-US", {
                weekday: "short",
              }),
              temperature: Math.floor(item.main.temp) + "°",
              description: item.weather[0].description,
              weatherImg: item.weather[0].main.toLowerCase(),
            };
          }
        });
  
        res.render("index.ejs", {
          currentWeather,
          forecastData,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        res.render("index.ejs", { error: "Unable to fetch weather data." });
      }
    })
  );
  

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
