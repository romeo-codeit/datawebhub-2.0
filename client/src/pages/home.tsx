import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Github, Linkedin, Twitter, Rocket, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/lib/animations";

export default function Home() {
  useScrollReveal();

  return (
    <>
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="particle w-2 h-2 top-1/4 left-1/4 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="particle w-3 h-3 top-3/4 left-1/3 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="particle w-1 h-1 top-1/2 left-3/4 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="particle w-2 h-2 top-1/6 left-4/5 animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 scroll-reveal">
              <div className="space-y-4">
                <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="block text-cyanPrimary">{import.meta.env.VITE_HERO_TITLE_1 || "Your"}</span>
                  <span className="block gradient-text">{import.meta.env.VITE_HERO_TITLE_2 || "Portfolio"}</span>
                </h1>
                <p className="text-xl lg:text-2xl text-cyanPrimary/80 font-light leading-relaxed">
                  {import.meta.env.VITE_HERO_DESCRIPTION || "Your professional tagline and description goes here."}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/projects">
                  <Button 
                    className="bg-purpleAccent hover:bg-purpleAccent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
                    data-testid="button-view-work"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    View My Work
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button 
                    variant="outline"
                    className="border-2 border-blueAccent text-blueAccent hover:bg-blueAccent hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                    data-testid="button-lets-chat"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Let's Chat
                  </Button>
                </Link>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-4 pt-4">
                {/* Social links should be provided via environment variables */}
                {import.meta.env.VITE_GITHUB_URL && (
                  <a 
                    href={import.meta.env.VITE_GITHUB_URL} 
                    className="w-12 h-12 rounded-full glass-effect flex items-center justify-center hover:scale-110 transition-all duration-300 hover:bg-cyanPrimary/30"
                    data-testid="link-github"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5 text-cyanPrimary" />
                  </a>
                )}
                {import.meta.env.VITE_LINKEDIN_URL && (
                  <a 
                    href={import.meta.env.VITE_LINKEDIN_URL} 
                    className="w-12 h-12 rounded-full glass-effect flex items-center justify-center hover:scale-110 transition-all duration-300 hover:bg-cyanPrimary/30"
                    data-testid="link-linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5 text-cyanPrimary" />
                  </a>
                )}
                {import.meta.env.VITE_TWITTER_URL && (
                  <a 
                    href={import.meta.env.VITE_TWITTER_URL} 
                    className="w-12 h-12 rounded-full glass-effect flex items-center justify-center hover:scale-110 transition-all duration-300 hover:bg-cyanPrimary/30"
                    data-testid="link-twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-5 h-5 text-cyanPrimary" />
                  </a>
                )}
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative flex items-center justify-center scroll-reveal">
              {/* Hero image should be provided via environment variable */}
              {import.meta.env.VITE_HERO_IMAGE && (
                <img 
                  src={import.meta.env.VITE_HERO_IMAGE} 
                  alt="Workspace" 
                  className="rounded-3xl shadow-2xl w-full max-w-md lg:max-lg animate-float"
                />
              )}
              
              {/* Floating Tech Icons */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-darkPurple-300/90 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                <svg className="w-8 h-8 text-cyanPrimary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.47 0-.92.014-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.822-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.resident.41-.805.636-1.186.225-.435.496-.872.705-1.146.18-.203.365-.41.335-.988zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.36.034.47 0 .92-.014 1.36-.034-.44.572-.895 1.095-1.36 1.563-.48-.47-.92-.99-1.36-1.563z"/>
                </svg>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-darkPurple-300/90 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
                <svg className="w-8 h-8 text-purpleAccent" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L2.46,6.68C2.376,6.729,2.324,6.822,2.324,6.921v10.15c0,0.097,0.053,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.276-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/>
                </svg>
              </div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-darkPurple-300/90 rounded-full flex items-center justify-center shadow-lg animate-float">
                <svg className="w-6 h-6 text-blueAccent" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyanPrimary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyanPrimary/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
    </>
  );
}
