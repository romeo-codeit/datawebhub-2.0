import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SkillBar from "@/components/skill-bar";
import { useScrollReveal } from "@/lib/animations";

export default function About() {
  useScrollReveal();

  const skills = [
    { name: "React / Next.js", level: 95 },
    { name: "Node.js / Express", level: 90 },
    { name: "TypeScript", level: 88 },
    { name: "UI/UX Design", level: 85 }
  ];

  const experiences = [
    {
      title: "Senior Full-Stack Developer",
      company: "TechCorp Solutions",
      period: "2022 - Present",
      description: "Leading development of enterprise-level web applications with React, Node.js, and cloud infrastructure.",
      color: "calmBlue"
    },
    {
      title: "Frontend Developer",
      company: "Creative Agency",
      period: "2020 - 2022",
      description: "Developed responsive web applications and interactive experiences for Fortune 500 clients.",
      color: "warmOrange"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white/20 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-softNavy mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-softNavy/70 max-w-3xl mx-auto leading-relaxed">
            I'm a passionate full-stack developer with expertise in modern web technologies, 
            creating exceptional digital experiences that combine functionality with stunning design.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Profile */}
          <div className="lg:col-span-1 scroll-reveal">
            <div className="glass-effect rounded-2xl p-8 text-center">
              <Avatar className="w-48 h-48 mx-auto mb-6 border-4 border-white shadow-xl">
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400" 
                  alt="Professional headshot of creative developer" 
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <h3 className="font-heading text-2xl font-semibold text-softNavy mb-2" data-testid="text-name">
                Alex Johnson
              </h3>
              <p className="text-calmBlue font-medium mb-4" data-testid="text-title">
                Full-Stack Developer & UI/UX Designer
              </p>
              <p className="text-softNavy/70 text-sm leading-relaxed" data-testid="text-bio">
                5+ years crafting digital solutions that bridge the gap between 
                beautiful design and powerful functionality.
              </p>
            </div>
          </div>
          
          {/* Skills & Experience */}
          <div className="lg:col-span-2 space-y-8 scroll-reveal">
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="font-heading text-2xl font-semibold text-softNavy mb-6">
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
              <h3 className="font-heading text-2xl font-semibold text-softNavy mb-6">
                Experience
              </h3>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div 
                    key={exp.title} 
                    className={`border-l-4 pl-6 ${
                      exp.color === 'calmBlue' ? 'border-calmBlue' : 'border-warmOrange'
                    }`}
                  >
                    <h4 className="font-semibold text-softNavy text-lg" data-testid={`text-job-title-${index}`}>
                      {exp.title}
                    </h4>
                    <p className={`font-medium mb-2 ${
                      exp.color === 'calmBlue' ? 'text-calmBlue' : 'text-warmOrange-600'
                    }`} data-testid={`text-company-${index}`}>
                      {exp.company} • {exp.period}
                    </p>
                    <p className="text-softNavy/70 mt-2" data-testid={`text-description-${index}`}>
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
