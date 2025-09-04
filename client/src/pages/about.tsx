import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useScrollReveal } from "@/lib/animations";
import { Briefcase, Code, Star } from "lucide-react";

export default function About() {
  useScrollReveal();

  // NOTE: This is placeholder data for demonstration purposes.
  // In a real application, this data would likely be fetched from an API.
  const skills = [
    "JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Node.js", "GraphQL",
    "Tailwind CSS", "Figma", "Docker", "Kubernetes", "PostgreSQL", "Prisma",
    "AWS", "Google Cloud", "CI/CD", "Jest & Vitest"
  ];

  const experiences = [
    {
      title: "Senior Frontend Developer",
      company: "Innovate Inc.",
      period: "2021 - Present",
      description: "Currently leading the development of a new design system and component library from the ground up. My work has resulted in a 40% increase in development velocity and has been praised by the design team for its elegance and intuitiveness."
    },
    {
      title: "Full-Stack Developer",
      company: "Tech Solutions",
      period: "2018 - 2021",
      description: "I built and maintained scalable web applications for a diverse range of clients using React, Node.js, and PostgreSQL. I was responsible for all phases of the development lifecycle, from concept and design to deployment and maintenance."
    },
    {
      title: "Junior Web Developer",
      company: "Digital Creations",
      period: "2016 - 2018",
      description: "This was my first role in the industry, where I assisted in the development and maintenance of client websites, primarily using HTML, CSS, and JavaScript. I also gained foundational experience in version control with Git and agile methodologies."
    }
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
            About <span className="text-primary">Me</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            I'm a passionate full-stack developer with expertise in modern web technologies, 
            creating exceptional digital experiences that combine functionality with stunning design.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-16 items-start">
          {/* Left Column: Profile */}
          <div className="lg:col-span-1 space-y-8 scroll-reveal sticky top-24">
            <Avatar className="w-48 h-48 mx-auto border-4 border-primary shadow-xl">
              <AvatarImage src={(import.meta.env.VITE_USER_AVATAR) || ""} alt="Profile photo" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-heading text-3xl font-bold text-foreground" data-testid="text-name">
                {(import.meta.env.VITE_USER_NAME) || "Your Name"}
              </h3>
              <p className="text-primary text-lg font-medium" data-testid="text-title">
                {(import.meta.env.VITE_USER_TITLE) || "Your Professional Title"}
              </p>
            </div>
            <p className="text-muted-foreground text-center text-lg leading-relaxed" data-testid="text-bio">
              {(import.meta.env.VITE_USER_BIO) || "Add your professional bio via the VITE_USER_BIO environment variable."}
            </p>
          </div>
          
          {/* Right Column: Experience & Skills */}
          <div className="lg:col-span-2 space-y-16">
            {/* Experience Timeline */}
            <div className="scroll-reveal">
              <h3 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center">
                <Briefcase className="w-8 h-8 mr-4 text-primary" />
                Work Experience
              </h3>
              <div className="relative border-l-2 border-border pl-8 space-y-12">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-10 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    <p className="text-sm text-primary font-semibold">{exp.period}</p>
                    <h4 className="font-semibold text-foreground text-xl mt-1">{exp.title}</h4>
                    <p className="text-muted-foreground font-medium">{exp.company}</p>
                    <p className="text-muted-foreground mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Grid */}
            <div className="scroll-reveal">
              <h3 className="font-heading text-3xl font-bold text-foreground mb-8 flex items-center">
                <Code className="w-8 h-8 mr-4 text-primary" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center bg-card border rounded-lg px-4 py-2">
                    <Star className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium text-card-foreground">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
