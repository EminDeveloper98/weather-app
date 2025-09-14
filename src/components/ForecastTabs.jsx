import './ForecastTabs.css';
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from 'react-icons/wi';

const ForecastTabs = ({ hourlyData, dailyData, activeTab, setActiveTab }) => {
  // Отладочная информация
  console.log('ForecastTabs props:', {
    hourlyData,
    dailyData,
    activeTab,
    setActiveTab,
  });

  const getIcon = (icon) => {
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
    <div className="forecast-tabs">
      <div className="tabs-header">
        <button
          className={activeTab === 'hourly' ? 'active' : ''}
          onClick={() => {
            console.log('Клик по кнопке Почасовой');
            if (setActiveTab) {
              setActiveTab('hourly');
            } else {
              console.error('setActiveTab не определен!');
            }
          }}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          Почасовой
        </button>
        <button
          className={activeTab === 'daily' ? 'active' : ''}
          onClick={() => {
            console.log('Клик по кнопке Ежедневный');
            if (setActiveTab) {
              setActiveTab('daily');
            } else {
              console.error('setActiveTab не определен!');
            }
          }}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          Ежедневный
        </button>
      </div>

      <div className="tabs-content">
        {activeTab === 'hourly' && (
          <div className="hourly-forecast">
            {hourlyData.length > 0 ? (
              hourlyData.map((h, i) => (
                <div key={i} className="hour-item">
                  <div>{new Date(h.dt * 1000).getHours()}:00</div>
                  <div>{h.temp}°</div>
                  <div>{getIcon(h.icon)}</div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: 'white',
                }}
              >
                Введите название города для получения почасового прогноза
              </div>
            )}
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="daily-forecast">
            {dailyData.length > 0 ? (
              dailyData.map((d, i) => {
                // Валидация для предотвращения одинаковых значений температуры
                const validatedMinTemp =
                  d.temp_min !== d.temp_max ? d.temp_min : d.temp_min - 1;
                const validatedMaxTemp =
                  d.temp_min !== d.temp_max ? d.temp_max : d.temp_max + 1;

                return (
                  <div key={i} className="day-item">
                    <div>{d.date}</div>
                    <div>
                      {validatedMinTemp}° / {validatedMaxTemp}°
                    </div>
                    <div>{getIcon(d.icon)}</div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: 'white',
                }}
              >
                Введите название города для получения ежедневного прогноза
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastTabs;
