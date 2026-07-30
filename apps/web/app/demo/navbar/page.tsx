"use client";

import { Navbar } from "@/components/navbar";
import { Container } from "@/components/container";

export default function NavbarDemo() {
  const links = [
    { label: "Features", href: "#features" },
    { label: "Events", href: "#events" },
    { label: "Map", href: "#map" },
    { label: "About", href: "#about" },
  ];

  const ctaButton = {
    label: "Get Started",
    onClick: () => alert("CTA clicked!"),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        logoText="OpenWitness"
        links={links}
        ctaButton={ctaButton}
      />

      {/* Hero Section for Scroll Testing */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-background to-background">
        <Container>
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold text-white">
              Navbar Component Demo
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Scroll down to see the glassmorphism effect activate on the
              navigation bar
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Fixed positioning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Scroll-based glassmorphism</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Mobile responsive</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-zinc-900/50">
        <Container>
          <h2 className="text-4xl font-bold text-white mb-8">Features</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">
                Fixed Positioning
              </h3>
              <p>
                The navbar stays at the top of the viewport as you scroll,
                ensuring navigation is always accessible.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">
                Scroll-Based Glassmorphism
              </h3>
              <p>
                When scrolled past 50px, the navbar transitions to a frosted
                glass effect with backdrop blur and subtle background.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">
                Responsive Mobile Menu
              </h3>
              <p>
                On mobile devices, the navigation collapses into a hamburger
                menu with smooth slide-in animation.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">
                Hover Animations
              </h3>
              <p>
                Navigation links feature scale and color transitions on hover
                for a premium feel.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Events Section */}
      <section id="events" className="py-32">
        <Container>
          <h2 className="text-4xl font-bold text-white mb-8">
            Active Events
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl">
            This section demonstrates how the navbar maintains its position
            as you navigate through different sections of the page. The
            glassmorphism effect provides excellent readability over any
            background.
          </p>
        </Container>
      </section>

      {/* Map Section */}
      <section id="map" className="py-32 bg-zinc-900/50">
        <Container>
          <h2 className="text-4xl font-bold text-white mb-8">World Map</h2>
          <p className="text-lg text-gray-300 max-w-2xl">
            Keep scrolling to test the navbar behavior across different
            sections with varying backgrounds and content types.
          </p>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="py-32">
        <Container>
          <h2 className="text-4xl font-bold text-white mb-8">About</h2>
          <div className="space-y-4 text-gray-300 max-w-2xl">
            <p>
              The Navbar component is built with Framer Motion for smooth
              animations and uses the useScroll hook to track scroll position.
            </p>
            <p>
              Key technical features:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Scroll Detection:</strong> Uses Framer Motion&apos;s
                useScroll and useTransform to detect when scrolled past 50px
              </li>
              <li>
                <strong>Glassmorphism:</strong> Applies backdrop-blur-md with
                bg-white/6 when scrolled
              </li>
              <li>
                <strong>Mobile Menu:</strong> Slide-in panel with spring
                animation and backdrop overlay
              </li>
              <li>
                <strong>Accessibility:</strong> Proper ARIA labels, keyboard
                navigation, and 44x44px touch targets
              </li>
              <li>
                <strong>Body Scroll Lock:</strong> Prevents scrolling when
                mobile menu is open
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Usage Examples */}
      <section className="py-32 bg-zinc-900/50">
        <Container>
          <h2 className="text-4xl font-bold text-white mb-8">
            Usage Examples
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Basic Usage
              </h3>
              <pre className="p-6 rounded-lg bg-black/50 text-sm text-gray-300 overflow-x-auto">
{`<Navbar
  logoText="OpenWitness"
  links={[
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
  ]}
  ctaButton={{
    label: "Get Started",
    onClick: () => console.log("CTA clicked"),
  }}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                With Logo Image
              </h3>
              <pre className="p-6 rounded-lg bg-black/50 text-sm text-gray-300 overflow-x-auto">
{`<Navbar
  logoSrc="/logo.svg"
  logoText="OpenWitness"
  links={links}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                With External Links
              </h3>
              <pre className="p-6 rounded-lg bg-black/50 text-sm text-gray-300 overflow-x-auto">
{`<Navbar
  logoText="OpenWitness"
  links={[
    { label: "Home", href: "/" },
    { label: "Docs", href: "https://docs.example.com", external: true },
  ]}
/>`}
              </pre>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer for more scroll */}
      <footer className="py-16 border-t border-white/10">
        <Container>
          <p className="text-center text-gray-400">
            Scroll back to top to see the glassmorphism effect disappear
          </p>
        </Container>
      </footer>
    </div>
  );
}
