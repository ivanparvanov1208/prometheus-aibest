import './styles/main.css';

const features = [
  {
    title: 'Fast setup',
    text: 'Start building right away with a clean layout and reusable sections.'
  },
  {
    title: 'Modern design',
    text: 'A polished look with strong typography, spacing, and color contrast.'
  },
  {
    title: 'Easy to customize',
    text: 'Change the text, colors, and layout to match your brand in minutes.'
  }
];

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">Nova Studio</div>
        <nav>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-text">
            <p className="eyebrow">Creative web template</p>
            <h1>Design a better online presence.</h1>
            <p className="hero-description">
              Build your next landing page with a layout that feels clean, modern,
              and ready to impress visitors.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">Get started</a>
              <a className="button button-secondary" href="#features">Learn more</a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>98%</strong>
                <span>client satisfaction</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>support ready</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-card">
              <span>Growth dashboard</span>
              <h2>+32.4%</h2>
              <p>Monthly performance increase</p>
              <div className="panel-bars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="eyebrow">Why choose us</p>
            <h2>Everything you need to launch faster</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div>
            <p className="eyebrow">About</p>
            <h2>Simple, strong, and built to scale.</h2>
          </div>
          <p>
            This template gives you a clean foundation for portfolios, product pages,
            agencies, and personal brands.
          </p>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <p>Ready to build something great?</p>
        <a className="button button-primary" href="mailto:hello@novastudio.com">Contact us</a>
      </footer>
    </div>
  );
}

export default App;