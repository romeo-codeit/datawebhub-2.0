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
          className="font-heading text-xl font-semibold text-softNavy mb-2"
          data-testid={`text-project-title-${project.id}`}
        >
          {project.title}
        </h3>
        <p 
          className="text-softNavy/70 mb-4 text-sm leading-relaxed"
          data-testid={`text-project-description-${project.id}`}
        >
          {project.description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => {
            let colorClass = "bg-calmBlue/20 text-calmBlue";
            
            if (index % 3 === 1) colorClass = "bg-warmOrange/20 text-warmOrange-600";
            if (index % 3 === 2) colorClass = "bg-green-100 text-green-600";
            
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
              className="text-calmBlue hover:text-calmBlue-600 transition-colors p-0 h-auto"
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
              className="text-softNavy hover:text-softNavy-600 transition-colors p-0 h-auto"
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
