import React from 'react';
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from 'react-icons/wi';
import './HourlyForecast.css';

const HourlyForecast = ({ data }) => {
  if (!data || data.length === 0) return null;

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

  const formatHour = (dt) => {
    const date = new Date(dt * 1000);
    return date.getHours() + ':00';
  };

  return (
    <div className="hourly-forecast">
      {data.map((hour, index) => (
        <div key={index} className="hourly-item">
          <div className="hour">{formatHour(hour.dt)}</div>
          <div className="hour-icon">
            {getWeatherIcon(hour.weather[0].icon)}
          </div>
          <div className="hour-temp">{Math.round(hour.temp)}°</div>
        </div>
      ))}
    </div>
  );
};

export default HourlyForecast;
