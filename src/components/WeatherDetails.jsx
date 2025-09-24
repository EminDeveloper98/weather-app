import './WeatherDetails.css';
import {
  WiHumidity,
  WiStrongWind,
  WiCloud,
  WiThermometer,
} from 'react-icons/wi';

const WeatherDetails = ({
  humidity,
  wind,
  clouds,
  temp_min,
  temp_max,
  formatTemp,
}) => {
  const validatedMinTemp = temp_min !== temp_max ? temp_min : temp_min - 1;
  const validatedMaxTemp = temp_min !== temp_max ? temp_max : temp_max + 1;

  return (
    <div className="weather-details">
      <div className="detail-item min-temp">
        <WiThermometer size={24} /> Min: {formatTemp(validatedMinTemp)}°C
      </div>
      <div className="detail-item max-temp">
        <WiThermometer size={24} /> Max: {formatTemp(validatedMaxTemp)}°C
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
