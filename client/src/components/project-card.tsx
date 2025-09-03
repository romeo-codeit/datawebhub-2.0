import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="project-card glass-effect rounded-2xl overflow-hidden scroll-reveal">
      <img 
        src={project.imageUrl} 
        alt={`${project.title} - ${project.description}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 
          className="font-heading text-xl font-semibold text-cyanPrimary mb-2"
          data-testid={`text-project-title-${project.id}`}
        >
          {project.title}
        </h3>
        <p 
          className="text-cyanPrimary/70 mb-4 text-sm leading-relaxed"
          data-testid={`text-project-description-${project.id}`}
        >
          {project.description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => {
            let colorClass = "bg-cyanPrimary/20 text-cyanPrimary";
            
            if (index % 3 === 1) colorClass = "bg-purpleAccent/20 text-purpleAccent-600";
            if (index % 3 === 2) colorClass = "bg-blueAccent/20 text-blueAccent-600";
            
            return (
              <span 
                key={tech}
                className={`px-3 py-1 text-xs rounded-full ${colorClass}`}
                data-testid={`tech-${tech.toLowerCase()}-${project.id}`}
              >
                {tech}
              </span>
            );
          })}
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {project.demoUrl && (
            <Button
              variant="link"
              size="sm"
              className="text-cyanPrimary hover:text-cyanPrimary-600 transition-colors p-0 h-auto"
              asChild
              data-testid={`link-demo-${project.id}`}
            >
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Demo
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button
              variant="link"
              size="sm"
              className="text-cyanPrimary hover:text-cyanPrimary-600 transition-colors p-0 h-auto"
              asChild
              data-testid={`link-github-${project.id}`}
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-1" />
                Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
