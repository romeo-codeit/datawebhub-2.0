import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";
import { Link } from "wouter";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, imageUrl, technologies = [], demoUrl, id } = project;

  return (
    <Link href={`/projects/${id}`} className="block">
      <div className="project-card bg-card rounded-2xl overflow-hidden scroll-reveal border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
        <img
          src={imageUrl}
          alt={`${title} - ${description}`}
        className="w-full h-56 object-cover"
      />
      <div className="p-6">
        <h3 
          className="font-heading text-lg md:text-xl font-bold text-card-foreground mb-2"
          data-testid={`text-project-title-${id}`}
        >
          {title}
        </h3>
        <p 
          className="text-muted-foreground mb-4 text-sm md:text-base leading-relaxed"
          data-testid={`text-project-description-${id}`}
        >
          {description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
              data-testid={`tech-${tech.toLowerCase()}-${id}`}
            >
              {tech}
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
        </div>
      </div>
    </div>
    </Link>
  );
}