import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, imageUrl, tags = [], demoUrl, githubUrl, id } = project;

  return (
    <div className="project-card bg-card rounded-2xl overflow-hidden scroll-reveal border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <img 
        src={imageUrl}
        alt={`${title} - ${description}`}
        className="w-full h-56 object-cover"
      />
      <div className="p-6">
        <h3 
          className="font-heading text-xl font-bold text-card-foreground mb-2"
          data-testid={`text-project-title-${id}`}
        >
          {title}
        </h3>
        <p 
          className="text-muted-foreground mb-4 text-base leading-relaxed"
          data-testid={`text-project-description-${id}`}
        >
          {description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
              data-testid={`tech-${tag.toLowerCase()}-${id}`}
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-4">
          {demoUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              data-testid={`link-demo-${id}`}
            >
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              data-testid={`link-github-${id}`}
            >
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
