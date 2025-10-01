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
import bgWeatherMobile from '../assets/bg-weather-mobile.png';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WeatherCard = () => {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); // 🔹 добавили
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [inputFocused, setInputFocused] = useState(false);

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
    if (icon.startsWith('01'))
      return <WiDaySunny className="weather-svg-icon sun" />;
    if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04'))
      return <WiCloudy className="weather-svg-icon cloud" />;
    if (icon.startsWith('09') || icon.startsWith('10'))
      return <WiRainMix className="weather-svg-icon rain" />;
    if (icon.startsWith('11'))
      return <WiThunderstorm className="weather-svg-icon thunder" />;
    if (icon.startsWith('13'))
      return <WiSnow className="weather-svg-icon snow" />;
    if (icon.startsWith('50'))
      return <WiFog className="weather-svg-icon fog" />;
    return <WiCloudy className="weather-svg-icon cloud" />;
  };

  const getFullWeatherDescription = (main) => {
    if (!main) return '';
    switch (main.toLowerCase()) {
      case 'clouds':
        return 'Cloudy throughout the day. Morning showers stopped by noon. Afternoon remains overcast.';
      case 'rain':
        return 'Rain expected in the morning. Afternoon showers continue. Evening rain eases.';
      case 'snow':
        return 'Snow in the morning. Light snow in the afternoon. Clears by evening.';
      case 'clear':
        return 'Sunny all day. Evening gets cooler. No precipitation expected.';
      case 'thunderstorm':
        return 'Thunderstorms in the morning. Afternoon less intense. Clears by night.';
      case 'mist':
      case 'fog':
        return 'Foggy in the morning. Clears by afternoon. Evening mist returns.';
      default:
        return 'Weather varies throughout the day.';
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
        setLoading(true); // 🔹 старт загрузки
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();

        if (data.cod !== 200) {
          setWeatherData(null);
          setError(true);
          setLoading(false); // 🔹 конец загрузки
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
        setLoading(false); // 🔹 конец загрузки
      } catch {
        setWeatherData(null);
        setError(true);
        setLoading(false); // 🔹 конец загрузки
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <div className="weather-container">
      {/* Фон */}
      <div
        className="bg-video"
        style={{
          backgroundImage: `url(${isMobile ? bgWeatherMobile : bgWeather})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <img src={weatherIcon} alt="logo" className="logo-icon" />

      <div className="left-panel">
        {weatherData && !error && !loading && (
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

      <div
        className="right-panel"
        style={{
          transform:
            isMobile && inputFocused ? 'translateY(-150px)' : 'translateY(0)',
          transition: 'transform 0.3s ease',
        }}
      >
        <SearchBar
          onSearch={(newCity) => {
            setCity(newCity);
            setWeatherData(null);
          }}
          onInputChange={() => setWeatherData(null)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />

        {weatherData && !error && !loading && (
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

      {/* 🔹 Сообщения внизу */}
      {(loading || error) && (
        <div className="bottom-status">
          {loading ? 'Loading...' : 'City not found'}
        </div>
      )}

      <footer className="footer">
        &copy; {new Date().getFullYear()} All rights reserved
      </footer>
    </div>
  );
};

export default WeatherCard;
