import './WeatherDetails.css';
import {
  WiHumidity,
  WiStrongWind,
  WiCloud,
  WiThermometer,
} from 'react-icons/wi';

const WeatherDetails = ({ humidity, wind, clouds, temp_min, temp_max }) => {
  return (
    <div className="weather-details">
      <div className="detail-item min-temp">
        <WiThermometer size={24} /> Min: {temp_min}°C
      </div>
      <div className="detail-item max-temp">
        <WiThermometer size={24} /> Max: {temp_max}°C
      </div>
      <div className="detail-item">
        <WiHumidity size={24} /> Humidity: {humidity}%
      </div>
      <div className="detail-item">
        <WiStrongWind size={24} /> Wind: {wind} m/s
      </div>
      <div className="detail-item">
        <WiCloud size={24} /> Clouds: {clouds}%
      </div>
    </div>
  );
};

export default WeatherDetails;
