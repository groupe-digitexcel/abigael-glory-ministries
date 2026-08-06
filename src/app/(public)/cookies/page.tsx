export default function CookiesPage() {
  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-[var(--color-pearl)] mb-3">Cookie Policy</h1>
        <p className="text-[var(--color-mist)] text-sm mb-10">Last updated: June 2026</p>

        <div className="flex flex-col gap-8 text-[var(--color-mist)] leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device that help websites remember information about
              your visit, such as your login session and preferences.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">How We Use Cookies</h2>
            <p>
              Abigael Glory Ministries uses cookies primarily for authentication — keeping you signed in as you
              navigate between pages. Our authentication provider, Supabase, sets secure session cookies that
              are essential for the Platform to function. We do not use cookies for advertising or third-party
              tracking.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">Essential Cookies</h2>
            <p>
              Session cookies set by Supabase Auth are strictly necessary for login functionality and cannot be
              disabled without losing the ability to sign in to your account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">Payment Processor Cookies</h2>
            <p>
              When you make a donation or subscribe via Chariow, that provider may set its own
              cookies during the checkout process, governed by their respective privacy and cookie policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">Managing Cookies</h2>
            <p>
              Most browsers allow you to control cookies through their settings. Note that disabling essential
              cookies will prevent you from staying signed in to your AGM account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">Contact Us</h2>
            <p>
              Questions about this policy can be sent to{' '}
              <a href="mailto:info@agm.church" className="text-[var(--color-gold)] hover:underline">info@agm.church</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
