import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Github, Linkedin, Twitter, Rocket, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/lib/animations";

export default function Home() {
  useScrollReveal();

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 sm:py-0">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8 scroll-reveal text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter">
                <span className="block text-primary">{(import.meta.env.VITE_HERO_TITLE_1) || "Creative"}</span>
                <span className="block text-foreground">{(import.meta.env.VITE_HERO_TITLE_2) || "Developer"}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light max-w-lg mx-auto lg:mx-0">
                {(import.meta.env.VITE_HERO_DESCRIPTION) || "Crafting immersive digital experiences with cutting-edge technology and thoughtful design"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/projects">
                <Button size="lg" data-testid="button-view-work">
                  <Rocket />
                  View My Work
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline" data-testid="button-lets-chat">
                  <MessageCircle />
                  Let's Chat
                </Button>
              </Link>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4 pt-6 justify-center lg:justify-start">
              {/* Social links should be provided via environment variables */}
              <div className="flex gap-3">
                {(import.meta.env.VITE_GITHUB_URL) && (
                  <a
                    href={import.meta.env.VITE_GITHUB_URL}
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110"
                    data-testid="link-github"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {(import.meta.env.VITE_LINKEDIN_URL) && (
                  <a
                    href={import.meta.env.VITE_LINKEDIN_URL}
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110"
                    data-testid="link-linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
                {(import.meta.env.VITE_TWITTER_URL) && (
                  <a
                    href={import.meta.env.VITE_TWITTER_URL}
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110"
                    data-testid="link-twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
                {!(import.meta.env.VITE_GITHUB_URL) && !(import.meta.env.VITE_LINKEDIN_URL) && !(import.meta.env.VITE_TWITTER_URL) && (
                  <p className="text-muted-foreground text-sm">Add social links via environment variables</p>
                )}
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative flex items-center justify-center scroll-reveal">
            {/* Hero image should be provided via environment variable */}
            <div className="w-full max-w-md lg:max-w-lg mx-auto">
              {(import.meta.env.VITE_HERO_IMAGE) ? (
                <img
                  src={import.meta.env.VITE_HERO_IMAGE}
                  alt="Workspace"
                  className="rounded-2xl shadow-xl w-full"
                />
              ) : (
                <div className="w-full h-80 bg-secondary rounded-2xl shadow-xl flex items-center justify-center">
                  <p className="text-secondary-foreground text-center px-4">Add VITE_HERO_IMAGE<br />to display your image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
