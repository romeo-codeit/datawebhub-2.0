import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SkillBar from "@/components/skill-bar";
import { useScrollReveal } from "@/lib/animations";

export default function About() {
  useScrollReveal();

  // Skills should be fetched from API in production
  const skills: Array<{name: string, level: number}> = [
    { name: "React & Next.js", level: 95 },
    { name: "Node.js & Express", level: 90 },
    { name: "TypeScript", level: 90 },
    { name: "Tailwind CSS", level: 98 },
    { name: "Figma & UI Design", level: 85 },
  ];

  // Experiences should be fetched from API in production
  const experiences: Array<{title: string, company: string, period: string, description: string, color: string}> = [
    { title: "Senior Frontend Developer", company: "Innovate Inc.", period: "2021 - Present", description: "Leading the development of a new design system and component library.", color: "primary" },
    { title: "Full-Stack Developer", company: "Tech Solutions", period: "2018 - 2021", description: "Built and maintained scalable web applications for various clients.", color: "accent" },
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
        
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Profile */}
          <div className="lg:col-span-1 scroll-reveal">
            <div className="bg-card rounded-2xl p-8 text-center shadow-lg border">
              <Avatar className="w-40 h-40 mx-auto mb-6 border-4 border-primary shadow-xl">
                {/* Avatar image should be provided via environment variable or API */}
                <AvatarImage 
                  src={(import.meta.env.VITE_USER_AVATAR) || ""} 
                  alt="Profile photo" 
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <h3 className="font-heading text-2xl font-bold text-card-foreground mb-1" data-testid="text-name">
                {/* Name should be provided via environment variable */}
                {(import.meta.env.VITE_USER_NAME) || "Your Name"}
              </h3>
              <p className="text-primary font-medium mb-4" data-testid="text-title">
                {/* Title should be provided via environment variable */}
                {(import.meta.env.VITE_USER_TITLE) || "Your Professional Title"}
              </p>
              <p className="text-muted-foreground text-base leading-relaxed" data-testid="text-bio">
                {/* Bio should be provided via environment variable */}
                {(import.meta.env.VITE_USER_BIO) || "Add your professional bio via the VITE_USER_BIO environment variable."}
              </p>
            </div>
          </div>
          
          {/* Skills & Experience */}
          <div className="lg:col-span-2 space-y-12 scroll-reveal">
            <div className="bg-card rounded-2xl p-8 shadow-lg border">
              <h3 className="font-heading text-3xl font-bold text-card-foreground mb-6">
                Technical Skills
              </h3>
              <div className="space-y-5">
                {skills.map((skill, index) => (
                  <SkillBar 
                    key={skill.name} 
                    name={skill.name} 
                    level={skill.level}
                    delay={index * 150}
                  />
                ))}
              </div>
            </div>
            
            {/* Experience Timeline */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border">
              <h3 className="font-heading text-3xl font-bold text-card-foreground mb-8">
                Work Experience
              </h3>
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div 
                    key={exp.title} 
                    className={`border-l-4 pl-6 ${
                      exp.color === 'primary' ? 'border-primary' : 'border-accent'
                    }`}
                  >
                    <h4 className="font-semibold text-card-foreground text-xl" data-testid={`text-job-title-${index}`}>
                      {exp.title}
                    </h4>
                    <p className={`font-medium mb-2 text-primary`} data-testid={`text-company-${index}`}>
                      {exp.company} • {exp.period}
                    </p>
                    <p className="text-muted-foreground mt-2" data-testid={`text-description-${index}`}>
                      {exp.description}
                    </p>
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
