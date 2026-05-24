export default function Privacy() {
  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: 'var(--pub-badge-pill-text)', fontWeight: 600, marginBottom: '1.5rem' }}>Privacy Policy</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1.2rem', color: 'var(--pub-text)' }}>Privacy & Data Policy</h1>
          <p style={{ color: 'var(--pub-text-sub)', fontSize: '1.1rem' }}>Last updated: May 23, 2026</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 24, padding: '2.5rem', lineHeight: 1.8 }}>
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>1. Introduction</h2>
            <p style={{ color: 'var(--pub-text-sub)' }}>
              Welcome to ManufactoCRM AI. We are dedicated to protecting your proprietary manufacturing business data, lead logs, activities, and user details. This policy governs how we collect, process, secure, and retain your data when using our SaaS platform.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>2. Data Collection</h2>
            <p style={{ color: 'var(--pub-text-sub)', marginBottom: '0.8rem' }}>
              We collect information to deliver a personalized CRM experience. This includes:
            </p>
            <ul style={{ color: 'var(--pub-text-sub)', paddingLeft: '1.5rem' }}>
              <li>Account credentials (names, hashed passwords, work email address).</li>
              <li>Lead records (company names, deal values, statuses, phone numbers).</li>
              <li>AI prompts and activity logs compiled during workflow generation.</li>
              <li>Integrations tokens (e.g. ERP integration keys, encrypted).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>3. How We Use Data</h2>
            <p style={{ color: 'var(--pub-text-sub)' }}>
              All captured lead data is isolated on a tenant level. We do not use your proprietary business records or lead databases to train public foundation models. We use your data to populate dashboards, compute KPIs, enable BDA task management, and trigger specific AI insights requested by your users.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>4. Data Security</h2>
            <p style={{ color: 'var(--pub-text-sub)' }}>
              We deploy advanced security policies including HTTPS/TLS 1.3 in-transit encryption, AES-256 at-rest database encryption, and isolated schema tenancy to shield your critical lead data from any unauthorized access.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1rem' }}>5. Contact Support</h2>
            <p style={{ color: 'var(--pub-text-sub)' }}>
              If you have any questions or require your data to be completely expunged, please contact our team at privacy@manufactocrm.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
