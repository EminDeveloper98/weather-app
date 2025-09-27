import { useState, useEffect } from 'react';
import './WeatherCard.css';
import './WeatherCard.mobile.css';
import SearchBar from './SearchBar';
import WeatherDetails from './WeatherDetails';

import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from 'react-icons/wi';

import weatherIcon from '../assets/icons/weathericon.png';
import bgWeather from '../assets/bg-weather.jpg';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WeatherCard = () => {
  const [city, setCity] = useState('London'); // город по умолчанию
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [error, setError] = useState(false);

  const formatTemp = (temp) =>
    temp > 0 ? `+${Math.round(temp)}` : Math.round(temp);

  // функция для выбора иконки
  const getWeatherIcon = (icon) => {
    if (!icon) return null;
    if (icon.startsWith('01'))
      return <WiDaySunny size={80} className="sun-icon" />;
    if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04'))
      return <WiCloud size={80} className="cloud-icon" />;
    if (icon.startsWith('09') || icon.startsWith('10'))
      return <WiRain size={80} className="rain-icon" />;
    if (icon.startsWith('11'))
      return <WiThunderstorm size={80} className="rain-icon" />;
    if (icon.startsWith('13'))
      return <WiSnow size={80} className="rain-icon" />;
    if (icon.startsWith('50'))
      return <WiFog size={80} className="cloud-icon" />;
    return <WiCloud size={80} className="cloud-icon" />;
  };

  // обновление времени каждую секунду
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      };
      const dateString = now.toLocaleDateString('en-US', options);
      setCurrentTime(`${hours}:${minutes} - ${dateString}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // загрузка погоды при смене города
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setError(false);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.cod !== 200) {
          setWeatherData(null);
          setError(true);
          return;
        }

        setWeatherData({
          temp: data.main.temp,
          temp_min: data.main.temp_min,
          temp_max: data.main.temp_max,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          clouds: data.clouds.all,
          icon: data.weather[0].icon,
          name: data.name,
        });
      } catch {
        setWeatherData(null);
        setError(true);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <div className="weather-container">
      <div
        className="bg-video"
        style={{
          backgroundImage: `url(${bgWeather})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <img src={weatherIcon} alt="logo" className="logo-icon" />

      <div className="left-panel">
        {error ? (
          <div style={{ fontSize: '36px', color: 'white' }}>City not found</div>
        ) : weatherData ? (
          <>
            <div className="temperature">{formatTemp(weatherData.temp)}°</div>
            <div className="city-time">
              <div className="location">{weatherData.name}</div>
              <div className="current-time">{currentTime}</div>
            </div>
            <div className="weather-icon">
              {getWeatherIcon(weatherData.icon)}
            </div>
          </>
        ) : (
          <div style={{ fontSize: '36px', color: 'white' }}>Loading...</div>
        )}
      </div>

      <div className="right-panel">
        <SearchBar onSearch={setCity} />
        {weatherData && !error && (
          <WeatherDetails
            humidity={weatherData.humidity}
            wind={weatherData.wind}
            clouds={weatherData.clouds}
            temp_min={weatherData.temp_min}
            temp_max={weatherData.temp_max}
            formatTemp={formatTemp}
          />
        )}
      </div>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Все права защищены
      </footer>
    </div>
  );
};

export default WeatherCard;
