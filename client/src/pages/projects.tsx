import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/project-card";
import { useScrollReveal } from "@/lib/animations";
import { Loader2, Plus } from "lucide-react";

type FilterType = 'all' | 'web' | 'mobile' | 'design';

// Dummy data for projects
const allProjects = [
  { id: 1, title: "E-commerce Platform", description: "A full-featured e-commerce site with a modern UI.", imageUrl: "/placeholder.svg", tags: ["web", "design"], category: "web" },
  { id: 2, title: "Task Management App", description: "A mobile-first task management application.", imageUrl: "/placeholder.svg", tags: ["mobile"], category: "mobile" },
  { id: 3, title: "Portfolio Website", description: "A personal portfolio to showcase my work.", imageUrl: "/placeholder.svg", tags: ["web", "design"], category: "web" },
  { id: 4, title: "Design System", description: "A comprehensive design system for a large-scale application.", imageUrl: "/placeholder.svg", tags: ["design"], category: "design" },
  { id: 5, title: "Social Media App", description: "A concept for a new social media platform.", imageUrl: "/placeholder.svg", tags: ["mobile", "design"], category: "mobile" },
  { id: 6, title: "Data Visualization Tool", description: "A tool for visualizing complex data sets.", imageUrl: "/placeholder.svg", tags: ["web"], category: "web" },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(false); // Mock loading state
  
  useScrollReveal();

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return allProjects;
    return allProjects.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'web', label: 'Web Apps' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'design', label: 'Design' },
  ];

  return (
    <section id="projects" className="py-24 sm:py-32 bg-background min-h-screen">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A showcase of my latest work, featuring innovative solutions and cutting-edge technologies.
          </p>
        </div>
        
        {/* Project Filters */}
        <div className="flex justify-center mb-16 scroll-reveal">
          <div className="bg-card border rounded-xl p-2 flex gap-2 flex-wrap shadow-sm">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "default" : "ghost"}
                onClick={() => setActiveFilter(filter.key)}
                className="px-5 py-2.5 rounded-lg font-semibold"
                data-testid={`filter-${filter.key}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-foreground mb-4">No projects found</h3>
                <p className="text-muted-foreground">
                  {activeFilter === 'all' 
                    ? 'No projects are available at the moment.' 
                    : `No ${activeFilter} projects found. Try a different filter.`}
                </p>
              </div>
            )}
            
            <div className="text-center scroll-reveal">
              <Button 
                size="lg"
                variant="outline"
                data-testid="button-load-more"
              >
                <Plus className="w-5 h-5 mr-2" />
                Load More Projects
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
