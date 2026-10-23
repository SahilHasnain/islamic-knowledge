import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Darul Kutub",
  description:
    "How Darul Kutub handles information: what is stored on your device, what is never collected, and who processes technical data.",
};

const EFFECTIVE_DATE = "23 October 2026";

export default function PrivacyPolicy() {
  return (
    <main className="legal-page min-h-screen bg-background text-foreground">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Darul Kutub home">
          <span className="brand-mark">د</span>
          <span>Darul Kutub</span>
        </Link>
        <span className="header-note">The digital Islamic library</span>
        <Link className="header-link" href="/">
          <span>←</span> Back to library
        </Link>
      </header>

      <article className="legal-content">
        <div className="legal-intro">
          <p className="eyebrow">
            <span className="eyebrow-line" /> PRIVACY POLICY
          </p>
          <h1>
            Your reading is
            <br />
            <em>your own.</em>
          </h1>
          <p className="legal-lead">
            Darul Kutub is a library, not an account. There is no sign-up, no newsletter, and no
            profile. This page explains the small amount of information the website and the
            Android app handle, and why.
          </p>
          <p className="legal-effective">Effective {EFFECTIVE_DATE}</p>
          <div className="reader-rule" aria-hidden="true">
            <span>۞</span>
          </div>
        </div>

        <section className="legal-section" id="scope">
          <div className="legal-section-heading">
            <span>01</span>
            <h2>What this policy covers</h2>
          </div>
          <div className="legal-body">
            <p>
              This policy applies to the Darul Kutub website at{" "}
              <strong>darulkutub.durood.live</strong> and to the Darul Kutub Android application
              published on Google Play under the package name <strong>com.darulkutub</strong>.
            </p>
            <p>
              The Android app is a Trusted Web Activity. It opens the same website inside a
              Chrome-based window, so reading takes place on the website itself and the same rules
              apply to both.
            </p>
          </div>
        </section>

        <section className="legal-section" id="not-collected">
          <div className="legal-section-heading">
            <span>02</span>
            <h2>What we do not collect</h2>
          </div>
          <div className="legal-body">
            <p>We do not ask for, and do not collect, any of the following:</p>
            <ul className="legal-list">
              <li>Names, email addresses, phone numbers, or postal addresses</li>
              <li>Accounts, passwords, or any kind of sign-in</li>
              <li>Payment or financial details</li>
              <li>Precise or approximate location</li>
              <li>Contacts, calendars, photos, files, camera, or microphone access</li>
              <li>Advertising identifiers, and we serve no advertising</li>
              <li>Behavioural analytics, heat maps, or session recording</li>
              <li>Health, biometric, or any other sensitive personal data</li>
            </ul>
            <p>
              The app requests no Android permissions for personal data. It does not read your
              device identifiers or install other software.
            </p>
          </div>
        </section>

        <section className="legal-section" id="on-device">
          <div className="legal-section-heading">
            <span>03</span>
            <h2>Information kept on your device</h2>
          </div>
          <div className="legal-body">
            <p>
              To make reading comfortable, the website stores a few small preferences in your
              browser&rsquo;s local storage. These values stay on your device, are never sent to us
              or to anyone else, and are not readable by other websites.
            </p>
            <ul className="legal-list">
              <li>
                <strong>Reading position</strong> — how far you have scrolled in a book, so you can
                continue where you stopped.
              </li>
              <li>
                <strong>Last opened book</strong> — so the library can show what you were reading.
              </li>
              <li>
                <strong>Reading settings</strong> — text size, line spacing, and page width.
              </li>
            </ul>
            <p>
              No account is needed for any of this. You can erase it at any time by clearing the
              site data for <strong>darulkutub.durood.live</strong> in your browser settings, or by
              clearing the app&rsquo;s storage in Android settings. Uninstalling the app removes it
              as well. Nothing needs to be deleted on a server, because none of it was sent to a
              server.
            </p>
            <p>
              The website also registers a service worker. It keeps a small offline page on your
              device so a failed connection shows a friendly message. It does not save your reading
              history or book content.
            </p>
          </div>
        </section>

        <section className="legal-section" id="technical">
          <div className="legal-section-heading">
            <span>04</span>
            <h2>Technical data from normal web traffic</h2>
          </div>
          <div className="legal-body">
            <p>
              Like any website, this one is served by a hosting provider, which necessarily
              processes standard request information in order to deliver pages and protect the
              service. This is limited to technical data such as:
            </p>
            <ul className="legal-list">
              <li>The requested page address and the time of the request</li>
              <li>IP address, browser type and version, and device platform</li>
              <li>Referring page, where your browser sends one</li>
              <li>Error and security events, such as blocked or abusive requests</li>
            </ul>
            <p>
              This information is used only to operate, secure, and troubleshoot the service. It
              is not used to build a profile of you, is not sold, and is not combined with reading
              activity. The site is delivered through a content delivery network, so requests may
              pass through servers in more than one region.
            </p>
            <p>
              We do not use cookies for advertising or tracking, and there is no third-party
              analytics script on the site.
            </p>
          </div>
        </section>

        <section className="legal-section" id="third-parties">
          <div className="legal-section-heading">
            <span>05</span>
            <h2>Services involved</h2>
          </div>
          <div className="legal-body">
            <p>
              A small number of providers necessarily take part in delivering the library. Each
              handles data under its own policy:
            </p>
            <ul className="legal-list">
              <li>
                <strong>Google Play</strong> — distributes the Android app and reports installs and
                crashes to us in aggregate form. Google&rsquo;s own privacy policy governs that
                processing, including information linked to your Google account.
              </li>
              <li>
                <strong>Our hosting and content delivery provider</strong> — serves the website and
                processes the technical request data described above.
              </li>
              <li>
                <strong>Your browser or Chrome engine</strong> — renders the library and manages
                local storage on your device on our behalf.
              </li>
            </ul>
            <p>
              We do not sell, rent, or trade information, and we do not share it for cross-context
              behavioural advertising.
            </p>
          </div>
        </section>

        <section className="legal-section" id="children">
          <div className="legal-section-heading">
            <span>06</span>
            <h2>Children</h2>
          </div>
          <div className="legal-body">
            <p>
              Darul Kutub is a general-audience library suitable for all ages. Because we collect
              no personal information from anyone, we also collect none from children. There are no
              accounts, messages, uploads, or user-generated content.
            </p>
          </div>
        </section>

        <section className="legal-section" id="security">
          <div className="legal-section-heading">
            <span>07</span>
            <h2>Security</h2>
          </div>
          <div className="legal-body">
            <p>
              The site and app are served over HTTPS, so traffic between your device and the server
              is encrypted in transit. Because we hold no accounts or stored personal data, there is
              no database of readers to breach.
            </p>
            <p>
              No system is perfectly secure. If you believe you have found a security issue, please
              report it through the developer contact on our Google Play listing so it can be fixed
              promptly.
            </p>
          </div>
        </section>

        <section className="legal-section" id="rights">
          <div className="legal-section-heading">
            <span>08</span>
            <h2>Your choices</h2>
          </div>
          <div className="legal-body">
            <p>
              You remain in control of everything stored on your device. You may clear site data,
              clear app storage, or uninstall the app at any time, and the library will keep working
              afterwards. Because we hold no reader records, there is no separate request to make
              for access, correction, or deletion.
            </p>
            <p>
              If your region grants rights over personal data, those rights apply to data held by
              the providers listed above; please use their own privacy controls for anything linked
              to your Google account or browser.
            </p>
          </div>
        </section>

        <section className="legal-section" id="changes">
          <div className="legal-section-heading">
            <span>09</span>
            <h2>Changes to this policy</h2>
          </div>
          <div className="legal-body">
            <p>
              If the library later adds a feature that changes how information is handled — for
              example optional notifications or an account — this page will be updated before that
              feature is released, and the effective date above will change. Continued use after an
              update means you accept the revised policy.
            </p>
          </div>
        </section>

        <section className="legal-section" id="contact">
          <div className="legal-section-heading">
            <span>10</span>
            <h2>Contact</h2>
          </div>
          <div className="legal-body">
            <p>
              Questions about this policy or about privacy in the library can be sent through the
              developer contact details shown on the Darul Kutub listing in Google Play.
            </p>
          </div>
        </section>

        <div className="reader-end">
          <span>۞</span>
          <p>May your reading be private and beneficial.</p>
          <Link href="/">
            Return to the library <span>↗</span>
          </Link>
        </div>
      </article>

      <footer className="site-footer">
        <Link className="brand" href="/">
          <span className="brand-mark">د</span>
          <span>Darul Kutub</span>
        </Link>
        <span>Made for the love of knowledge.</span>
        <Link href="/privacy">PRIVACY ↑</Link>
      </footer>
    </main>
  );
}
