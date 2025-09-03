import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SkillBar from "@/components/skill-bar";
import { useScrollReveal } from "@/lib/animations";

export default function About() {
  useScrollReveal();

  // Skills should be fetched from API in production
  const skills: Array<{name: string, level: number}> = [];

  // Experiences should be fetched from API in production
  const experiences: Array<{title: string, company: string, period: string, description: string, color: string}> = [];

  return (
    <section id="about" className="py-20 bg-darkPurple/20 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-cyanPrimary mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-cyanPrimary/70 max-w-3xl mx-auto leading-relaxed">
            I'm a passionate full-stack developer with expertise in modern web technologies, 
            creating exceptional digital experiences that combine functionality with stunning design.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Profile */}
          <div className="lg:col-span-1 scroll-reveal">
            <div className="glass-effect rounded-2xl p-8 text-center">
              <Avatar className="w-48 h-48 mx-auto mb-6 border-4 border-white shadow-xl">
                {/* Avatar image should be provided via environment variable or API */}
                <AvatarImage 
                  src={import.meta.env.VITE_USER_AVATAR || ""} 
                  alt="Profile photo" 
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <h3 className="font-heading text-2xl font-semibold text-cyanPrimary mb-2" data-testid="text-name">
                {/* Name should be provided via environment variable */}
                {import.meta.env.VITE_USER_NAME || "Your Name"}
              </h3>
              <p className="text-purpleAccent font-medium mb-4" data-testid="text-title">
                {/* Title should be provided via environment variable */}
                {import.meta.env.VITE_USER_TITLE || "Your Title"}
              </p>
              <p className="text-cyanPrimary/70 text-sm leading-relaxed" data-testid="text-bio">
                {/* Bio should be provided via environment variable */}
                {import.meta.env.VITE_USER_BIO || "Your professional bio goes here."}
              </p>
            </div>
          </div>
          
          {/* Skills & Experience */}
          <div className="lg:col-span-2 space-y-8 scroll-reveal">
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="font-heading text-2xl font-semibold text-cyanPrimary mb-6">
                Technical Skills
              </h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <SkillBar 
                    key={skill.name} 
                    name={skill.name} 
                    level={skill.level}
                    delay={index * 200}
                  />
                ))}
              </div>
            </div>
            
            {/* Experience Timeline */}
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="font-heading text-2xl font-semibold text-cyanPrimary mb-6">
                Experience
              </h3>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div 
                    key={exp.title} 
                    className={`border-l-4 pl-6 ${
                      exp.color === 'cyanPrimary' ? 'border-cyanPrimary' : 'border-purpleAccent'
                    }`}
                  >
                    <h4 className="font-semibold text-cyanPrimary text-lg" data-testid={`text-job-title-${index}`}>
                      {exp.title}
                    </h4>
                    <p className={`font-medium mb-2 ${
                      exp.color === 'cyanPrimary' ? 'text-cyanPrimary' : 'text-purpleAccent-600'
                    }`} data-testid={`text-company-${index}`}>
                      {exp.company} • {exp.period}
                    </p>
                    <p className="text-cyanPrimary/70 mt-2" data-testid={`text-description-${index}`}>
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
