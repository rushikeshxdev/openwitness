"use client";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { ArrowRight, Download, Play, Heart, Star, Zap } from "lucide-react";

/**
 * Button Component Demo Page
 * Showcases all Button variants, sizes, and features
 */

export default function ButtonDemoPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <Container size="lg">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Button Component Demo
            </h1>
            <p className="text-xl text-gray-400">
              Explore all variants, sizes, and interactive features
            </p>
          </div>

          {/* Variants Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => console.log("Primary clicked")}>
                Primary Button
              </Button>
              <Button variant="secondary" onClick={() => console.log("Secondary clicked")}>
                Secondary Button
              </Button>
              <Button variant="ghost" onClick={() => console.log("Ghost clicked")}>
                Ghost Button
              </Button>
            </div>
          </section>

          {/* Sizes Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Sizes</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small Button</Button>
              <Button size="md">Medium Button</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </section>

          {/* With Icons Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">With Icons</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl text-gray-300 mb-3">Icon Right (default)</h3>
                <div className="flex flex-wrap gap-4">
                  <Button icon={ArrowRight}>Next Page</Button>
                  <Button variant="secondary" icon={Download}>
                    Download
                  </Button>
                  <Button variant="ghost" icon={Play}>
                    Watch Video
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-xl text-gray-300 mb-3">Icon Left</h3>
                <div className="flex flex-wrap gap-4">
                  <Button icon={Star} iconPosition="left">
                    Favorite
                  </Button>
                  <Button variant="secondary" icon={Heart} iconPosition="left">
                    Like
                  </Button>
                  <Button variant="ghost" icon={Zap} iconPosition="left">
                    Quick Action
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* All Variant and Size Combinations */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">
              Variant × Size Matrix
            </h2>
            <div className="space-y-6">
              {/* Primary */}
              <div className="space-y-3">
                <h3 className="text-xl text-gray-300">Primary</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" size="sm">
                    Small
                  </Button>
                  <Button variant="primary" size="md">
                    Medium
                  </Button>
                  <Button variant="primary" size="lg">
                    Large
                  </Button>
                </div>
              </div>

              {/* Secondary */}
              <div className="space-y-3">
                <h3 className="text-xl text-gray-300">Secondary</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="secondary" size="sm">
                    Small
                  </Button>
                  <Button variant="secondary" size="md">
                    Medium
                  </Button>
                  <Button variant="secondary" size="lg">
                    Large
                  </Button>
                </div>
              </div>

              {/* Ghost */}
              <div className="space-y-3">
                <h3 className="text-xl text-gray-300">Ghost</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="ghost" size="sm">
                    Small
                  </Button>
                  <Button variant="ghost" size="md">
                    Medium
                  </Button>
                  <Button variant="ghost" size="lg">
                    Large
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Disabled State */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Disabled State</h2>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Primary Disabled</Button>
              <Button variant="secondary" disabled>
                Secondary Disabled
              </Button>
              <Button variant="ghost" disabled>
                Ghost Disabled
              </Button>
            </div>
          </section>

          {/* Interactive Features */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">
              Interactive Features
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  ✨ Hover Effects
                </h3>
                <p className="text-gray-400">
                  Hover over buttons to see scale animation and glow effects
                </p>
                <Button variant="primary">Hover Me</Button>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  💫 Click Ripple Effect
                </h3>
                <p className="text-gray-400">
                  Click any button to see the ripple animation from click point
                </p>
                <div className="flex gap-4">
                  <Button variant="primary">Click Me</Button>
                  <Button variant="secondary">Click Me Too</Button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-lg font-semibold text-white">🎯 Tap Scale</h3>
                <p className="text-gray-400">
                  Buttons scale down slightly when pressed for tactile feedback
                </p>
                <Button variant="ghost">Press & Hold</Button>
              </div>
            </div>
          </section>

          {/* Real-world Examples */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">
              Real-World Examples
            </h2>
            <div className="space-y-6">
              {/* CTA Section Mock */}
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-500/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center space-y-6">
                <h3 className="text-3xl font-bold text-white">
                  Ready to Get Started?
                </h3>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Join thousands of users who trust OpenWitness to preserve and
                  verify evidence from important events.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="primary" size="lg" icon={ArrowRight}>
                    Start Free Trial
                  </Button>
                  <Button variant="ghost" size="lg" icon={Play}>
                    Watch Demo
                  </Button>
                </div>
              </div>

              {/* Action Bar Mock */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">
                    Event #12345
                  </h3>
                  <div className="flex gap-3">
                    <Button variant="ghost" size="sm" icon={Download}>
                      Export
                    </Button>
                    <Button variant="secondary" size="sm" icon={Star}>
                      Save
                    </Button>
                    <Button variant="primary" size="sm" icon={ArrowRight}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
