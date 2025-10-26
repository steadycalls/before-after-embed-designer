import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Palette, Code, Zap } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <span className="font-bold text-xl">{APP_TITLE}</span>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/designer">
                  <Button>Create Embed</Button>
                </Link>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-24">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Create Stunning Before/After Embeds
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Design interactive case study comparisons that automatically match your brand's colors and fonts
              </p>
              <div className="flex gap-4 justify-center">
                {isAuthenticated ? (
                  <Link href="/designer">
                    <Button size="lg" variant="secondary" className="text-lg px-8">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Start Creating
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                    <a href={getLoginUrl()}>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get Started Free
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Everything You Need
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Palette className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Auto Brand Matching</CardTitle>
                  <CardDescription>
                    Simply enter your website URL and we'll automatically extract your brand colors and fonts
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>Interactive Toggle</CardTitle>
                  <CardDescription>
                    Visitors can easily switch between before and after images with a smooth, engaging toggle
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Easy Embedding</CardTitle>
                  <CardDescription>
                    Get clean, optimized code that works anywhere. Just copy and paste into your website
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Images</h3>
                  <p className="text-gray-600">
                    Upload your before and after images showing the transformation or comparison you want to showcase
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Extract Your Brand Style</h3>
                  <p className="text-gray-600">
                    Enter your website URL and we'll automatically pull your brand colors and fonts to style the embed
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Get Your Embed Code</h3>
                  <p className="text-gray-600">
                    Copy the generated code and paste it anywhere on your website. It's that simple!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Showcase Your Work?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Create your first interactive before/after embed in minutes
            </p>
            {isAuthenticated ? (
              <Link href="/designer">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Create Your First Embed
                </Button>
              </Link>
            ) : (
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <a href={getLoginUrl()}>Get Started Now</a>
              </Button>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container text-center text-gray-600">
          <p>&copy; 2025 {APP_TITLE}. Built with ❤️ for designers and marketers.</p>
        </div>
      </footer>
    </div>
  );
}

