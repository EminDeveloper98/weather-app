import React from 'react';
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from 'react-icons/wi';
import './DailyForecast.css';

const DailyForecast = ({ data }) => {
  if (!data || data.length === 0) return <div>Нет данных</div>;

  const getWeatherIcon = (icon) => {
    if (!icon) return null;
    if (icon.startsWith('01')) return <WiDaySunny size={30} color="#fff" />;
    if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04'))
      return <WiCloud size={30} color="#fff" />;
    if (icon.startsWith('09') || icon.startsWith('10'))
      return <WiRain size={30} color="#fff" />;
    if (icon.startsWith('11')) return <WiThunderstorm size={30} color="#fff" />;
    if (icon.startsWith('13')) return <WiSnow size={30} color="#fff" />;
    if (icon.startsWith('50')) return <WiFog size={30} color="#fff" />;
    return <WiCloud size={30} color="#fff" />;
  };

  return (
    <div className="daily-forecast">
      {data.map((day, index) => {
        // Валидация для предотвращения одинаковых значений температуры
        const validatedMinTemp =
          day.temp_min !== day.temp_max ? day.temp_min : day.temp_min - 1;
        const validatedMaxTemp =
          day.temp_min !== day.temp_max ? day.temp_max : day.temp_max + 1;

        return (
          <div key={index} className="day-item">
            <div>{day.date}</div>
            <div>
              {validatedMinTemp}° / {validatedMaxTemp}°
            </div>
            <div>{getWeatherIcon(day.icon)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyForecast;
