import React, { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [search, setSearch] = useState("mumbai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${search}&appid=${
          import.meta.env.REACT_APP_API_KEY
        }`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("City not found");
        }
        const data = await response.json();
        setWeatherData(data);
        setError(null);
      } catch (error) {
        setWeatherData(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  const handleRefresh = () => {
    setSearch("mumbai");
  };

  const getTimeSinceUpdate = (timestamp) => {
    const now = Date.now() / 1000;
    const secondsAgo = now - timestamp;
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);

    if (hoursAgo > 0) {
      return `${hoursAgo} hours ago`;
    } else if (minutesAgo > 0) {
      return `${minutesAgo} minutes ago`;
    } else {
      return `${Math.floor(secondsAgo)} seconds ago`;
    }
  };

  return (
    <div className="weather-app">
      <div className="header">
        <h1>Weather App</h1>
        <div className="input-container">
          <input
            type="search"
            placeholder="Enter a city..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button onClick={handleRefresh}>Refresh</button>
        </div>
      </div>
      <div className="weather-info">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {weatherData && (
          <div className="weather-details">
            <div className="weather-overview">
              <h2 className="city">{weatherData.name}</h2>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                alt="weather icon"
              />
              <p>{weatherData.weather[0].description}</p>
            </div>
            <div className="temperature-details">
              <p>Temperature: {weatherData.main.temp}°C</p>
              <p>Feels Like: {weatherData.main.feels_like}°C</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind Speed: {weatherData.wind.speed} m/s</p>
              <p>Visibility: {weatherData.visibility} meters</p>
              <p>Cloud Cover: {weatherData.clouds.all}%</p>
              <p>Last updated:{getTimeSinceUpdate(weatherData.dt)}</p>
            </div>
          </div>
        )}
      </div>
      <footer className="weather-footer">
        <p>© Weather App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
