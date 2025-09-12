import { useEffect, useState } from 'react';
import './WeatherCard.css';
import SearchBar from './SearchBar';
import WeatherDetails from './WeatherDetails';
import ForecastTabs from './ForecastTabs';
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from 'react-icons/wi';

// Импорты картинок
import clearImg from '../assets/clear.jpg';
import cloudsImg from '../assets/clouds.jpg';
import rainImg from '../assets/rain.jpg';
import snowImg from '../assets/snow.jpg';
import thunderImg from '../assets/thunder.jpg';
import fogImg from '../assets/fog.jpg';

// Дефолтное видео
import defaultVideo from '../assets/videos/default.mp4';

const WeatherCard = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Получаем текущую погоду
  useEffect(() => {
    if (!city) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) {
          setWeatherData({
            temp: Math.round(data.main.temp),
            temp_min: Math.round(data.main.temp_min),
            temp_max: Math.round(data.main.temp_max),
            humidity: data.main.humidity,
            wind: data.wind.speed,
            clouds: data.clouds.all,
            name: data.name,
            date: new Date().toLocaleString(),
            icon: data.weather[0].icon,
            coord: data.coord,
          });
        } else {
          setWeatherData(null);
          setHourlyData([]);
          setDailyData([]);
        }
      })
      .catch(() => {
        setWeatherData(null);
        setHourlyData([]);
        setDailyData([]);
      });
  }, [city, API_KEY]);

  // Получаем почасовой и ежедневный прогноз
  useEffect(() => {
    if (!weatherData?.coord) return;

    const { lat, lon } = weatherData.coord;
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        // Почасовой прогноз (12 часов)
        const hourly = data.hourly.slice(0, 12).map((h) => ({
          time: new Date(h.dt * 1000).getHours() + ':00',
          temp: Math.round(h.temp),
          icon: getWeatherIcon(h.weather[0].icon),
        }));
        setHourlyData(hourly);

        // Ежедневный прогноз (7 дней)
        const daily = data.daily.slice(0, 7).map((d) => ({
          date: new Date(d.dt * 1000).toLocaleDateString('ru-RU', {
            weekday: 'short',
          }),
          temp_min: Math.round(d.temp.min),
          temp_max: Math.round(d.temp.max),
          icon: getWeatherIcon(d.weather[0].icon),
        }));
        setDailyData(daily);
      })
      .catch(() => {
        setHourlyData([]);
        setDailyData([]);
      });
  }, [weatherData, API_KEY]);

  // Иконки погоды
  const getWeatherIcon = (icon) => {
    if (!icon) return null;
    if (icon.startsWith('01'))
      return <WiDaySunny size={40} color="#fff" className="sun-icon" />;
    if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04'))
      return <WiCloud size={40} color="#fff" className="cloud-icon" />;
    if (icon.startsWith('09') || icon.startsWith('10'))
      return <WiRain size={40} color="#fff" className="rain-icon" />;
    if (icon.startsWith('11'))
      return <WiThunderstorm size={40} color="#fff" className="rain-icon" />;
    if (icon.startsWith('13'))
      return <WiSnow size={40} color="#fff" className="rain-icon" />;
    if (icon.startsWith('50'))
      return <WiFog size={40} color="#fff" className="cloud-icon" />;
    return <WiCloud size={40} color="#fff" className="cloud-icon" />;
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
      {/* Фон */}
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

      {/* Левая панель */}
      <div className="left-panel">
        <div className="temperature">
          {weatherData ? `${weatherData.temp}°` : ''}
        </div>
        <div className="location">
          {weatherData === null && city
            ? 'Город не найден'
            : !city
            ? 'search 🌤'
            : weatherData.name}
        </div>
        <div className="date">{weatherData ? weatherData.date : ''}</div>
        <div className="weather-icon">{getWeatherIcon(weatherData?.icon)}</div>
      </div>

      {/* Правая панель */}
      <div className="right-panel">
        <SearchBar onSearch={setCity} />

        {weatherData && (
          <WeatherDetails
            humidity={weatherData.humidity}
            wind={weatherData.wind}
            clouds={weatherData.clouds}
            temp_min={
              dailyData.length > 0
                ? dailyData[0].temp_min
                : weatherData.temp_min
            }
            temp_max={
              dailyData.length > 0
                ? dailyData[0].temp_max
                : weatherData.temp_max
            }
          />
        )}

        {weatherData && (
          <ForecastTabs hourlyData={hourlyData} dailyData={dailyData} />
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
