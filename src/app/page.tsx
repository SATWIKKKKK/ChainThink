import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight">
            Learn to <span className="text-primary">Think</span>, Not Just Answer
          </h1>
          <p className="text-xl text-muted-foreground">
            ChainThink is an AI tutor that teaches you how to solve problems,
            not just hands you solutions.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/auth/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Socratic Method</h3>
            <p className="text-sm text-muted-foreground">
              We ask questions that make you think, not give you answers that make you copy.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Adaptive Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Get hints that match your struggle level—never too easy, never overwhelming.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Build Real Skills</h3>
            <p className="text-sm text-muted-foreground">
              Develop problem-solving muscles that work on exams and interviews, not just homework.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mt-24 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Choose a problem</h4>
                <p className="text-sm text-muted-foreground">
                  Start with dynamic programming fundamentals
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Think alongside the AI</h4>
                <p className="text-sm text-muted-foreground">
                  Answer questions, explain your reasoning, try approaches
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Get validated, not corrected</h4>
                <p className="text-sm text-muted-foreground">
                  AI checks your reasoning process, not just your answer
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold">Build lasting understanding</h4>
                <p className="text-sm text-muted-foreground">
                  Master the pattern, not just memorize the solution
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <Button asChild size="lg">
            <Link href="/auth/login">Start Learning</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}