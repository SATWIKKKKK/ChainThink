import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Sparkles, MessageSquare, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight">
            Your AI <span className="text-white">Chat</span> Assistant
          </h1>
          <p className="text-xl text-muted-foreground">
            Chat with the most powerful AI models in one place. Choose from GPT-4, Claude, Gemini, Llama, and more.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/auth/login">Start Chatting</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Multiple Models</h3>
            <p className="text-sm text-muted-foreground">
              Access GPT-4, Claude, Gemini, Llama, Mistral and more - all in one place.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Chat History</h3>
            <p className="text-sm text-muted-foreground">
              All your conversations saved and organized. Pick up right where you left off.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Fast & Reliable</h3>
            <p className="text-sm text-muted-foreground">
              Powered by OpenRouter for blazing fast responses with high availability.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mt-24 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Sign in with Google</h4>
                <p className="text-sm text-muted-foreground">
                  Quick and secure authentication in one click
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Choose your AI model</h4>
                <p className="text-sm text-muted-foreground">
                  Select from GPT-4, Claude, Gemini, and other top models
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Start chatting</h4>
                <p className="text-sm text-muted-foreground">
                  Ask anything - coding help, writing, analysis, creative tasks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <Button asChild size="lg">
            <Link href="/auth/login">Start Chatting Free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}