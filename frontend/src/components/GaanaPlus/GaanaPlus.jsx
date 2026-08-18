import { plusFeatures } from '../../data/content';
import './GaanaPlus.css';

function GaanaPlus() {
  return (
    <aside className="fade-in-section fade-in-5 sidebar">
      {/* Gaana Plus Card */}
      <div className="plus-card">
        <div className="plus-logo">
          <span className="plus-logo-gaana">gaana</span>
          <span className="plus-logo-plus">plus</span>
          <iconify-icon icon="twemoji:crown" style={{ fontSize: '20px', marginLeft: '4px', marginTop: '-4px' }}></iconify-icon>
        </div>

        <h3 className="plus-heading font-display">Music, without limits.</h3>

        <ul className="plus-features">
          {plusFeatures.map((feature, i) => (
            <li key={i} className="plus-feature">
              <iconify-icon
                icon="lucide:check"
                style={{ color: 'var(--gaana-red)', fontSize: '16px', flexShrink: 0, marginTop: '2px' }}
              ></iconify-icon>
              {feature}
            </li>
          ))}
        </ul>

        <button className="plus-cta" id="start-free-trial-btn">
          Start Free Trial
        </button>

        <div className="plus-pricing">
          <p className="plus-price">₹1 for 7 days</p>
          <p className="plus-subtext">Auto-renews after trial</p>
        </div>
      </div>

      {/* Feedback Tab */}
      <div className="feedback-tab" id="feedback-tab">
        <span className="feedback-text">Feedback</span>
      </div>
    </aside>
  );
}

export default GaanaPlus;
