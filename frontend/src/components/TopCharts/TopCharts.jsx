import { chartItems } from '../../data/content';
import ChartCard from './ChartCard';
import './TopCharts.css';

function TopCharts() {
  return (
    <section id="top-charts" className="fade-in-section fade-in-1 section-block">
      <div className="section-header">
        <h2 className="section-title">Top Charts</h2>
        <div className="section-header-right">
          <a href="#" id="view-all-charts" className="view-all-link">
            View All
          </a>
          <div className="nav-arrows">
            <button className="arrow-btn" id="chart-prev-btn">
              <iconify-icon icon="lucide:chevron-left" style={{ fontSize: '14px', color: '#9ca3af' }}></iconify-icon>
            </button>
            <button className="arrow-btn" id="chart-next-btn">
              <iconify-icon icon="lucide:chevron-right" style={{ fontSize: '14px', color: 'white' }}></iconify-icon>
            </button>
          </div>
        </div>
      </div>
      <div className="charts-grid">
        {chartItems.map((chart) => (
          <ChartCard key={chart.id} chart={chart} />
        ))}
      </div>
    </section>
  );
}

export default TopCharts;
