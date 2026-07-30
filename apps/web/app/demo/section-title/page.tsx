/**
 * Demo page for SectionTitle component
 * Showcases different configurations and variants
 */

import { SectionTitle } from "@/components/section-title";
import { Container } from "@/components/container";

export default function SectionTitleDemo() {
  return (
    <main className="min-h-screen bg-background py-24">
      <Container size="lg">
        <div className="space-y-24">
          {/* Left aligned without subtitle */}
          <section>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                Left Aligned (Default)
              </h3>
              <p className="text-sm text-gray-400">
                Basic title without subtitle, left aligned
              </p>
            </div>
            <SectionTitle title="Active Events Worldwide" />
          </section>

          {/* Center aligned with subtitle */}
          <section>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                Center Aligned with Subtitle
              </h3>
              <p className="text-sm text-gray-400">
                Title with supporting subtitle, center aligned
              </p>
            </div>
            <SectionTitle
              title="Our Global Reach"
              subtitle="Events documented from every corner of the world"
              alignment="center"
            />
          </section>

          {/* Right aligned */}
          <section>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                Right Aligned
              </h3>
              <p className="text-sm text-gray-400">
                Title aligned to the right
              </p>
            </div>
            <SectionTitle
              title="Recent Timeline"
              subtitle="Latest activity and updates"
              alignment="right"
            />
          </section>

          {/* Gradient text effect */}
          <section>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                Gradient Text Effect
              </h3>
              <p className="text-sm text-gray-400">
                Title with gradient text from blue to cyan
              </p>
            </div>
            <SectionTitle
              title="Truth Deserves Structure"
              subtitle="Preserving evidence with integrity and transparency"
              alignment="center"
              gradientText={true}
            />
          </section>

          {/* With custom className */}
          <section>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                Custom Styling
              </h3>
              <p className="text-sm text-gray-400">
                Title with additional custom classes
              </p>
            </div>
            <SectionTitle
              title="Trusted by Organizations"
              subtitle="Partners who believe in our mission"
              alignment="center"
              className="mb-12"
            />
          </section>

          {/* Multiple examples showing animation trigger */}
          <section>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                Scroll Animation Demo
              </h3>
              <p className="text-sm text-gray-400">
                Scroll down to see fade-in animations trigger as titles enter viewport
              </p>
            </div>
            <div className="space-y-48">
              <SectionTitle
                title="First Section"
                subtitle="This should animate when scrolling"
                alignment="left"
              />
              <SectionTitle
                title="Second Section"
                subtitle="This animates independently"
                alignment="center"
              />
              <SectionTitle
                title="Third Section"
                subtitle="Each section triggers on viewport entry"
                alignment="right"
              />
              <SectionTitle
                title="Final Section"
                subtitle="Animations only trigger once"
                alignment="center"
                gradientText={true}
              />
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
