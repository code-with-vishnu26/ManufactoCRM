export default function Terms() {
  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: 'var(--pub-badge-pill-text)', fontWeight: 600, marginBottom: '1.5rem' }}>Terms of Service</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1.2rem' }}>Terms & Conditions</h1>
          <p style={{ color: 'var(--pub-text-sub)', fontSize: '1.1rem' }}>Last updated: May 23, 2026</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 24, padding: '2.5rem', lineHeight: 1.8 }}>
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>1. Agreement to Terms</h2>
            <p style={{ color: 'var(--pub-text-sub)' }}>
              By registering an account and using the ManufactoCRM AI B2B enterprise platform, you agree to comply with and be bound by the following terms. Please read these terms carefully before accessing the dashboard services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>2. Account Registrations & Usage</h2>
            <p style={{ color: 'var(--pub-text-sub)' }}>
              You are responsible for safeguarding your login credentials (JWT keys, passwords) and supervising the roles of your employees. Any unauthorized action performed inside your workspace tenancy is your sole responsibility. We reserve the right to suspend accounts violating system integrity.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>3. Fair Use of AI Assistant Features</h2>
            <p style={{ color: 'var(--pub-text-sub)' }}>
              Our AI BDA features generate drafts, pitches, and summaries based on lead inputs. While we ensure high contextual relevance, you are responsible for reviewing any generated emails, contracts, or sales pitches before using them in customer communication.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>4. Subscriptions & Billing</h2>
            <p style={{ color: 'var(--pub-text-sub)' }}>
              Billing cycles are monthly or annual. If payment fails, we provide a 7-day grace period for you to update payment methods before dashboard features are temporarily restricted.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>5. Limitation of Liability</h2>
            <p style={{ color: 'var(--pub-text-sub)' }}>
              ManufactoCRM AI is provided "as is". In no event shall we be liable for any indirect, incidental, or consequential damages resulting from lead management activities, dashboard downtime, or AI predictions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
