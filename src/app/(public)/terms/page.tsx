export default function TermsPage() {
  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-[var(--color-pearl)] mb-3">Terms of Service</h1>
        <p className="text-[var(--color-mist)] text-sm mb-10">Last updated: June 2026</p>

        <div className="flex flex-col gap-8 text-[var(--color-mist)] leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using Abigael Glory Ministries ("AGM", "we", "us", "the Platform"),
              you agree to these Terms of Service. If you do not agree, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">2. Membership Tiers & Billing</h2>
            <p>
              AGM offers free and paid subscription tiers. Paid subscriptions renew automatically on a monthly
              or annual basis until canceled. You may cancel at any time through your account settings; access
              continues until the end of the current billing period. We do not offer prorated refunds for
              partial billing periods except where required by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">3. Donations</h2>
            <p>
              Donations made through the Platform are voluntary gifts to support ministry operations. Donations
              are generally non-refundable. If you believe a donation was made in error, contact us within 7 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">4. Affiliate Program</h2>
            <p>
              Kingdom Builder tier members may participate in our affiliate program, earning commission on
              referred subscriptions as described on the Affiliate page. AGM reserves the right to adjust
              commission rates, suspend accounts for fraudulent referral activity, and determine final payout
              amounts at its sole discretion. Commissions are paid out manually via Chariow.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">5. Content & Conduct</h2>
            <p>
              Sermons, courses, and devotionals on the Platform are the property of AGM and may not be
              redistributed, resold, or publicly rebroadcast without written permission. Prayer requests and
              community content must not contain harassment, hate speech, or content that endangers others.
              We reserve the right to remove content or suspend accounts that violate these standards.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">6. Disclaimer</h2>
            <p>
              AGM provides spiritual and educational content in good faith but makes no warranties regarding
              outcomes. The Platform and its content are provided "as is" without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">7. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Platform after changes
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-pearl)] mb-3">8. Contact Us</h2>
            <p>
              Questions about these Terms can be sent to{' '}
              <a href="mailto:info@agm.church" className="text-[var(--color-gold)] hover:underline">info@agm.church</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
