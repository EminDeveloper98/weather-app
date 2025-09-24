import { useEffect, useState } from 'react';
import './WeatherCard.css';
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

// Фоновые картинки
import clearImg from '../assets/clear.jpg';
import cloudsImg from '../assets/clouds.jpg';
import rainImg from '../assets/rain.jpg';
import snowImg from '../assets/snow.jpg';
import thunderImg from '../assets/thunder.jpg';
import fogImg from '../assets/fog.jpg';

// Видео по умолчанию
import defaultVideo from '../assets/videos/default.mp4';

const WeatherCard = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
      console.error(
        'API ключ не настроен! Создайте файл .env с VITE_WEATHER_API_KEY=ваш_ключ'
      );
    }
  }, [API_KEY]);

  // Формат температуры с +
  const formatTemp = (temp) =>
    temp > 0 ? `+${Math.round(temp)}` : Math.round(temp);

  // Получение текущей погоды
  useEffect(() => {
    if (!city || !API_KEY) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) {
          let temp_min = Math.round(data.main.temp_min);
          let temp_max = Math.round(data.main.temp_max);

          if (temp_min === temp_max) {
            const currentTemp = Math.round(data.main.temp);
            temp_min = Math.max(temp_min - 2, currentTemp - 3);
            temp_max = Math.min(temp_max + 2, currentTemp + 3);
          }

          setWeatherData({
            temp: Math.round(data.main.temp),
            temp_min,
            temp_max,
            humidity: data.main.humidity,
            wind: data.wind.speed,
            clouds: data.clouds.all,
            name: data.name,
            date: new Date().toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
              weekday: 'short',
            }),
            icon: data.weather[0].icon,
            coord: data.coord,
          });
        } else {
          setWeatherData(null);
        }
      })
      .catch(() => {
        setWeatherData(null);
      });
  }, [city, API_KEY]);

  // Иконки
  const getWeatherIcon = (icon) => {
    if (!icon) return null;
    if (icon.startsWith('01'))
      return <WiDaySunny size={40} className="sun-icon" />;
    if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04'))
      return <WiCloud size={40} className="cloud-icon" />;
    if (icon.startsWith('09') || icon.startsWith('10'))
      return <WiRain size={40} className="rain-icon" />;
    if (icon.startsWith('11'))
      return <WiThunderstorm size={40} className="rain-icon" />;
    if (icon.startsWith('13'))
      return <WiSnow size={40} className="rain-icon" />;
    if (icon.startsWith('50'))
      return <WiFog size={40} className="cloud-icon" />;
    return <WiCloud size={40} className="cloud-icon" />;
  };

  // Фон
  const getBackgroundMedia = () => {
    if (!weatherData) return { type: 'video', src: defaultVideo };
    const icon = weatherData.icon;
    if (!icon || icon.startsWith('01')) return { type: 'image', src: clearImg };
    if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04'))
      return { type: 'image', src: cloudsImg };
    if (icon.startsWith('09') || icon.startsWith('10'))
      return { type: 'image', src: rainImg };
    if (icon.startsWith('11')) return { type: 'image', src: thunderImg };
    if (icon.startsWith('13')) return { type: 'image', src: snowImg };
    if (icon.startsWith('50')) return { type: 'image', src: fogImg };
    return { type: 'image', src: clearImg };
  };

  const media = getBackgroundMedia();

  return (
    <div className="weather-container">
      {media.type === 'video' && (
        <video className="bg-video" autoPlay loop muted>
          <source src={media.src} type="video/mp4" />
        </video>
      )}
      {media.type === 'image' && (
        <div
          className="bg-video"
          style={{
            backgroundImage: `url(${media.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div className="left-panel">
        <div className="temperature">
          {weatherData ? `${formatTemp(weatherData.temp)}°` : ''}
        </div>
        <div className="location">
          {weatherData === null && city
            ? 'Город не найден'
            : !city
            ? 'Think I should take an umbrella today?'
            : weatherData.name}
        </div>
        <div className="weather-icon">{getWeatherIcon(weatherData?.icon)}</div>
      </div>

      <div className="right-panel">
        <SearchBar onSearch={setCity} />
        {weatherData && (
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
