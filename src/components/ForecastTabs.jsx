import { useState } from 'react';
import './ForecastTabs.css';

const ForecastTabs = ({ hourlyData, dailyData }) => {
  const [activeTab, setActiveTab] = useState('hourly');

  return (
    <div className="forecast-tabs">
      <div className="tabs-header">
        <button
          className={activeTab === 'hourly' ? 'active' : ''}
          onClick={() => setActiveTab('hourly')}
        >
          Почасовой
        </button>
        <button
          className={activeTab === 'daily' ? 'active' : ''}
          onClick={() => setActiveTab('daily')}
        >
          Ежедневный
        </button>
      </div>

      <div className="tabs-content">
        {activeTab === 'hourly' && (
          <div className="hourly-forecast">
            {hourlyData.map((hour, index) => (
              <div key={index} className="hour-item">
                <div>{hour.time}</div>
                <div>{hour.temp}°C</div>
                <div>{hour.icon}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="daily-forecast">
            {dailyData.map((day, index) => (
              <div key={index} className="day-item">
                <div>{day.date}</div>
                <div>
                  {day.temp_min}° / {day.temp_max}°
                </div>
                <div>{day.icon}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastTabs;
