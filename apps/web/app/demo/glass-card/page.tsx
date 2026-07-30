"use client";

import { GlassCard, Container } from "@/components";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";

/**
 * Demo page for GlassCard component
 * Showcases all variants and use cases
 */
export default function GlassCardDemo() {
  return (
    <div className="min-h-screen bg-background-primary py-12">
      <Container>
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-white">GlassCard Component</h1>
            <p className="text-xl text-gray-400">
              Glassmorphism cards with hover effects and variants
            </p>
          </div>

          {/* Default Variant */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Default Variant</h2>
              <p className="text-gray-400">
                Base glassmorphism styling without special hover effects
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard variant="default" className="p-6">
                <div className="space-y-3">
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <h3 className="text-xl font-semibold text-white">Event Details</h3>
                  <p className="text-gray-400">
                    Simple card with glassmorphism styling. No hover animations.
                  </p>
                </div>
              </GlassCard>

              <GlassCard variant="default" className="p-6">
                <div className="space-y-3">
                  <MapPin className="w-8 h-8 text-cyan-500" />
                  <h3 className="text-xl font-semibold text-white">Location Info</h3>
                  <p className="text-gray-400">
                    Perfect for static information displays.
                  </p>
                </div>
              </GlassCard>

              <GlassCard variant="default" className="p-6">
                <div className="space-y-3">
                  <Users className="w-8 h-8 text-purple-500" />
                  <h3 className="text-xl font-semibold text-white">Team Stats</h3>
                  <p className="text-gray-400">
                    Clean, minimal glass aesthetic.
                  </p>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* Hover Lift Variant */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Hover Lift Variant</h2>
              <p className="text-gray-400">
                Cards lift up with enhanced shadow on hover
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard variant="hover-lift" className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-blue-500">1,234</div>
                  <div className="text-sm text-gray-400">Active Events</div>
                </div>
              </GlassCard>

              <GlassCard variant="hover-lift" className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-cyan-500">5,678</div>
                  <div className="text-sm text-gray-400">Evidence Items</div>
                </div>
              </GlassCard>

              <GlassCard variant="hover-lift" className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-green-500">892</div>
                  <div className="text-sm text-gray-400">Verified</div>
                </div>
              </GlassCard>

              <GlassCard variant="hover-lift" className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-purple-500">456</div>
                  <div className="text-sm text-gray-400">Organizations</div>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* Hover Tilt Variant */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Hover Tilt Variant</h2>
              <p className="text-gray-400">
                3D tilt effect based on mouse position - try hovering!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard variant="hover-tilt" className="p-8">
                <div className="space-y-4">
                  <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg" />
                  <h3 className="text-xl font-semibold text-white">Climate Rally 2024</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      London, UK
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      2.3k evidence
                    </span>
                  </div>
                  <div className="inline-flex px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                    Verified
                  </div>
                </div>
              </GlassCard>

              <GlassCard variant="hover-tilt" className="p-8">
                <div className="space-y-4">
                  <div className="w-full h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
                  <h3 className="text-xl font-semibold text-white">Tech Conference</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      San Francisco, CA
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      1.8k evidence
                    </span>
                  </div>
                  <div className="inline-flex px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                    Pending
                  </div>
                </div>
              </GlassCard>

              <GlassCard variant="hover-tilt" className="p-8">
                <div className="space-y-4">
                  <div className="w-full h-40 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg" />
                  <h3 className="text-xl font-semibold text-white">Art Exhibition</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Paris, France
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      967 evidence
                    </span>
                  </div>
                  <div className="inline-flex px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                    Verified
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* Interactive Cards */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Interactive Cards</h2>
              <p className="text-gray-400">
                Cards with onClick handlers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard 
                variant="hover-lift" 
                className="p-8"
                onClick={() => alert("Card 1 clicked!")}
              >
                <div className="space-y-3">
                  <Calendar className="w-10 h-10 text-blue-500" />
                  <h3 className="text-2xl font-bold text-white">Clickable Card</h3>
                  <p className="text-gray-400">
                    This card has an onClick handler. Click to see the alert!
                  </p>
                  <div className="text-sm text-blue-400">Click me →</div>
                </div>
              </GlassCard>

              <GlassCard 
                variant="hover-tilt" 
                className="p-8"
                onClick={() => alert("Card 2 clicked!")}
              >
                <div className="space-y-3">
                  <MapPin className="w-10 h-10 text-cyan-500" />
                  <h3 className="text-2xl font-bold text-white">Tilt & Click</h3>
                  <p className="text-gray-400">
                    Combines 3D tilt effect with click interaction.
                  </p>
                  <div className="text-sm text-cyan-400">Try hovering and clicking →</div>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* Custom Styling */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Custom Styling</h2>
              <p className="text-gray-400">
                Cards with custom className overrides
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard variant="hover-lift" className="p-6 bg-blue-500/10 border-blue-500/30">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-blue-400">Custom Blue Theme</h3>
                  <p className="text-gray-400 text-sm">
                    Custom background and border colors
                  </p>
                </div>
              </GlassCard>

              <GlassCard variant="hover-lift" className="p-6 bg-purple-500/10 border-purple-500/30">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-purple-400">Custom Purple Theme</h3>
                  <p className="text-gray-400 text-sm">
                    Easily override with className prop
                  </p>
                </div>
              </GlassCard>

              <GlassCard variant="hover-lift" className="p-6 bg-green-500/10 border-green-500/30">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-400">Custom Green Theme</h3>
                  <p className="text-gray-400 text-sm">
                    Maintains all hover effects
                  </p>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Usage Examples</h2>
              <p className="text-gray-400">Code examples for each variant</p>
            </div>
            
            <GlassCard variant="default" className="p-8">
              <div className="space-y-4 font-mono text-sm">
                <div>
                  <div className="text-gray-400 mb-2">// Default variant</div>
                  <code className="text-cyan-400">
                    {'<GlassCard variant="default">'}
                    <br />
                    {'  <YourContent />'}
                    <br />
                    {'</GlassCard>'}
                  </code>
                </div>
                
                <div>
                  <div className="text-gray-400 mb-2">// Hover lift variant</div>
                  <code className="text-cyan-400">
                    {'<GlassCard variant="hover-lift">'}
                    <br />
                    {'  <StatCard />'}
                    <br />
                    {'</GlassCard>'}
                  </code>
                </div>
                
                <div>
                  <div className="text-gray-400 mb-2">// Hover tilt variant with click</div>
                  <code className="text-cyan-400">
                    {'<GlassCard variant="hover-tilt" onClick={handleClick}>'}
                    <br />
                    {'  <EventCard />'}
                    <br />
                    {'</GlassCard>'}
                  </code>
                </div>
              </div>
            </GlassCard>
          </section>
        </div>
      </Container>
    </div>
  );
}
