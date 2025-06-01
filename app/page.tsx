'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Database className="h-5 w-5" />
            <span>SheetDash</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative pb-20 pt-36 md:pb-32 md:pt-56">
          <div className="container flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium">
              <span className="mr-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                New
              </span>
              <span className="text-muted-foreground">
                Google Sheets as a database
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
              Manage Google Sheets <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                Like a Database
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground md:text-xl">
              SheetDash turns your Google Sheets into a powerful database with a beautiful dashboard interface. CRUD operations, authentication, and a modern UI—all without complex setups.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-1.5">
                  Get Started <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-muted py-20">
          <div className="container">
            <h2 className="text-center text-3xl font-bold md:text-4xl">
              Features
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Google Sheets Integration',
                  description: 'Connect any Google Sheet to use as your database with minimal configuration.',
                  icon: <Database className="h-10 w-10 text-primary" />,
                },
                {
                  title: 'CRUD Operations',
                  description: 'Create, read, update, and delete data with a clean interface.',
                  icon: <Database className="h-10 w-10 text-primary" />,
                },
                {
                  title: 'Authentication',
                  description: 'Secure access to your data with user authentication.',
                  icon: <Database className="h-10 w-10 text-primary" />,
                },
                {
                  title: 'Responsive Dashboard',
                  description: 'Beautiful, responsive dashboard that works on all devices.',
                  icon: <Database className="h-10 w-10 text-primary" />,
                },
                {
                  title: 'Form Validation',
                  description: 'Validate data before it enters your sheets.',
                  icon: <Database className="h-10 w-10 text-primary" />,
                },
                {
                  title: 'Data Visualization',
                  description: 'Visualize your data with beautiful charts and graphs.',
                  icon: <Database className="h-10 w-10 text-primary" />,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span className="font-medium">SheetDash</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} SheetDash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}