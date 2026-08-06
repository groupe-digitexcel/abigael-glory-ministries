export default function PrivacyPage() {
  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-[var(--color-pearl)] mb-3">Privacy Policy</h1>
        <p className="text-[var(--color-mist)] text-sm mb-10">Last updated: June 2026</p>

        <div className="flex flex-col gap-8 text-[var(--color-mist)] leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">1. Information We Collect</h2>
            <p>
              When you create an account with Abigael Glory Ministries ("AGM", "we", "us"), we collect your
              name, email address, and any profile information you choose to provide. When you make a donation
              or subscribe to a paid tier, our payment processor (Chariow) collects payment details
              directly — we never store your card or mobile money credentials on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to provide access to sermons, courses, and community features; to process
              payments and subscriptions; to send ministry updates and devotionals if you opt in; and to improve
              our platform. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">3. Prayer Requests</h2>
            <p>
              Prayer requests marked "public" are visible to other members of the community. Requests marked
              "anonymous" hide your name from other users but remain visible to ministry administrators for
              pastoral care purposes. You may delete your own prayer requests at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">4. Third-Party Services</h2>
            <p>
              We use Supabase for authentication and data storage, Resend for email delivery, OpenRouter for
              AI-generated content assistance, and Chariow for payment processing. Each of these
              providers maintains its own privacy practices governing data they process on our behalf.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">5. Your Rights</h2>
            <p>
              You may access, update, or delete your personal data at any time through your account settings.
              To request full account deletion, contact us at the email below. We retain donation records as
              required by applicable financial regulations even after account deletion.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">6. Children's Privacy</h2>
            <p>
              Our platform is not directed at children under 13. We do not knowingly collect personal information
              from children under 13. If you believe a child has provided us with personal information, please
              contact us so we can remove it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">7. Contact Us</h2>
            <p>
              For privacy questions or data requests, contact us at{' '}
              <a href="mailto:info@agm.church" className="text-[var(--color-gold)] hover:underline">info@agm.church</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
