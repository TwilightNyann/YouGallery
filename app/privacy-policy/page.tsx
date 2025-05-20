"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-grow">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">Last Updated: May 14, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to YouGallery. We respect your privacy and are committed to protecting your personal data. This
              privacy policy will inform you about how we look after your personal data when you visit our website and
              tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. The Data We Collect About You</h2>
            <p className="mb-4">
              Personal data, or personal information, means any information about an individual from which that person
              can be identified. It does not include data where the identity has been removed (anonymous data).
            </p>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped
              together as follows:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>
                <strong>Identity Data</strong> includes first name, last name, username or similar identifier.
              </li>
              <li>
                <strong>Contact Data</strong> includes email address and telephone numbers.
              </li>
              <li>
                <strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type
                and version, time zone setting and location, browser plug-in types and versions, operating system and
                platform, and other technology on the devices you use to access this website.
              </li>
              <li>
                <strong>Profile Data</strong> includes your username and password, your interests, preferences, feedback
                and survey responses.
              </li>
              <li>
                <strong>Usage Data</strong> includes information about how you use our website, products and services.
              </li>
              <li>
                <strong>Content Data</strong> includes photos, videos, and other media files you upload to our service.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Personal Data</h2>
            <p className="mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal
              data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>
                Where it is necessary for our legitimate interests (or those of a third party) and your interests and
                fundamental rights do not override those interests.
              </li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
            <p>
              Generally, we do not rely on consent as a legal basis for processing your personal data although we will
              get your consent before sending third party direct marketing communications to you via email or text
              message. You have the right to withdraw consent to marketing at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally
              lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your
              personal data to those employees, agents, contractors and other third parties who have a business need to
              know. They will only process your personal data on our instructions and they are subject to a duty of
              confidentiality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we
              collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or
              reporting requirements. We may retain your personal data for a longer period in the event of a complaint
              or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Legal Rights</h2>
            <p className="mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data,
              including the right to:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>
                <strong>Request access</strong> to your personal data.
              </li>
              <li>
                <strong>Request correction</strong> of your personal data.
              </li>
              <li>
                <strong>Request erasure</strong> of your personal data.
              </li>
              <li>
                <strong>Object to processing</strong> of your personal data.
              </li>
              <li>
                <strong>Request restriction of processing</strong> your personal data.
              </li>
              <li>
                <strong>Request transfer</strong> of your personal data.
              </li>
              <li>
                <strong>Right to withdraw consent</strong>.
              </li>
            </ul>
            <p>If you wish to exercise any of the rights set out above, please contact us.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
            <p>
              This website may include links to third-party websites, plug-ins and applications. Clicking on those links
              or enabling those connections may allow third parties to collect or share data about you. We do not
              control these third-party websites and are not responsible for their privacy statements. When you leave
              our website, we encourage you to read the privacy policy of every website you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
            <p>
              You can set your browser to refuse all or some browser cookies, or to alert you when websites set or
              access cookies. If you disable or refuse cookies, please note that some parts of this website may become
              inaccessible or not function properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to the Privacy Policy</h2>
            <p>
              We may update our privacy policy from time to time. We will notify you of any changes by posting the new
              privacy policy on this page and updating the "Last Updated" date at the top of this privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
            <div className="mt-4">
              <p>
                <strong>Email:</strong> privacy@yougallery.com
              </p>
              <p>
                <strong>Phone:</strong> 555-567-8901
              </p>
              <p>
                <strong>Address:</strong>
                <br />
                1234 Gallery St,
                <br />
                Photo City, Image State 12345
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
