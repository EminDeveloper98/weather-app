import { useState, useEffect } from 'react';
import { Textfit } from 'react-textfit';
import './WeatherCard.css';
import './WeatherCard.mobile.css';
import SearchBar from './SearchBar';
import WeatherDetails from './WeatherDetails';

import {
  WiDaySunny,
  WiCloudy,
  WiRainMix,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from 'react-icons/wi';

import weatherIcon from '../assets/icons/weathericon.png';
import bgWeather from '../assets/bg-weather.jpg';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WeatherCard = () => {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Проверка мобильного экрана
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTemp = (temp) =>
    temp > 0 ? `+${Math.round(temp)}` : Math.round(temp);

  const getWeatherIcon = (icon) => {
    if (!icon) return null;
    if (icon.startsWith('01')) return <WiDaySunny size={80} />;
    if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04'))
      return <WiCloudy size={80} />;
    if (icon.startsWith('09') || icon.startsWith('10'))
      return <WiRainMix size={80} />;
    if (icon.startsWith('11')) return <WiThunderstorm size={80} />;
    if (icon.startsWith('13')) return <WiSnow size={80} />;
    if (icon.startsWith('50')) return <WiFog size={80} />;
    return <WiCloudy size={80} />;
  };

  const getFullWeatherDescription = (main) => {
    if (!main) return '';
    switch (main.toLowerCase()) {
      case 'clouds':
        return `Cloudy throughout the day. Morning showers stopped by noon. Afternoon remains overcast.`;
      case 'rain':
        return `Rain expected in the morning. Afternoon showers continue. Evening rain eases.`;
      case 'snow':
        return `Snow in the morning. Light snow in the afternoon. Clears by evening.`;
      case 'clear':
        return `Sunny all day. Evening gets cooler. No precipitation expected.`;
      case 'thunderstorm':
        return `Thunderstorms in the morning. Afternoon less intense. Clears by night.`;
      case 'mist':
      case 'fog':
        return `Foggy in the morning. Clears by afternoon. Evening mist returns.`;
      default:
        return `Weather varies throughout the day.`;
    }
  };

  // Время
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const options = { weekday: 'long', day: 'numeric', month: 'short' };
      const dateString = now.toLocaleDateString('en-US', options);
      setCurrentTime(`${hours}:${minutes} - ${dateString}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Получение погоды
  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      try {
        setError(false);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();

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
          mainDescription: data.weather[0].main,
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
      {/* Мобильный статус сверху */}
      {isMobile && (error || !weatherData) && (
        <div className="mobile-status">
          {error ? 'City not found' : 'Loading...'}
        </div>
      )}

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
        {weatherData && !error && (
          <>
            <div className="temperature">{formatTemp(weatherData.temp)}°</div>
            <div className="city-time">
              <Textfit mode="single" max={66} min={24} className="location">
                {weatherData.name}
              </Textfit>
              <div className="current-time">{currentTime}</div>
            </div>
            <div className="weather-icon">
              {getWeatherIcon(weatherData.icon)}
            </div>
          </>
        )}
      </div>

      <div className="right-panel">
        <SearchBar
          onSearch={(newCity) => {
            setCity(newCity);
            setWeatherData(null); // скрываем старые данные при поиске
          }}
          onInputChange={() => {
            setWeatherData(null); // скрываем данные при вводе нового текста
          }}
        />
        {weatherData && !error && (
          <>
            <WeatherDetails
              humidity={weatherData.humidity}
              wind={weatherData.wind}
              clouds={weatherData.clouds}
              temp_min={weatherData.temp_min}
              temp_max={weatherData.temp_max}
              formatTemp={formatTemp}
            />
            <div className="weather-full-description">
              {getFullWeatherDescription(weatherData.mainDescription)}
            </div>
          </>
        )}
      </div>

      <footer className="footer">
        &copy; {new Date().getFullYear()} All rights reserved
      </footer>
    </div>
  );
};

export default WeatherCard;
