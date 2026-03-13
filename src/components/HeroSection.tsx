import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="ai-assistant__hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="ai-assistant__hero-title">
        Good morning, Nik
      </h1>
      <div className="ai-assistant__hero-body">
        <p style={{ margin: 0, marginBottom: 16 }}>
          <strong>Your network is stable.</strong>
        </p>
        <p style={{ margin: 0 }}>
          There are <strong>8 new actions</strong> that require review.
          <br />
          Would you like to review the urgent ones first?
        </p>
      </div>
      <Link to="/actions" className="ai-button ai-button--secondary ai-assistant__hero-review-btn">
        Review actions
      </Link>
    </section>
  )
}
