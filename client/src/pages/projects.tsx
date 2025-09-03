import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/project-card";
import { useProjects } from "@/hooks/use-projects";
import { useScrollReveal } from "@/lib/animations";
import { Loader2, Plus } from "lucide-react";

type FilterType = 'all' | 'web' | 'mobile' | 'design';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { data: projects, isLoading, error } = useProjects(activeFilter);
  
  useScrollReveal();

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'web', label: 'Web Apps' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'design', label: 'Design' },
  ];

  if (error) {
    return (
      <section className="py-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cyanPrimary mb-4">Unable to load projects</h2>
          <p className="text-cyanPrimary/70">Please check your connection and try again.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-cyanPrimary mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-cyanPrimary/70 max-w-3xl mx-auto leading-relaxed">
            A showcase of my latest work, featuring innovative solutions and cutting-edge technologies.
          </p>
        </div>
        
        {/* Project Filters */}
        <div className="flex justify-center mb-12 scroll-reveal">
          <div className="glass-effect rounded-xl p-2 flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-purpleAccent text-white hover:bg-purpleAccent-600'
                    : 'bg-transparent text-cyanPrimary hover:bg-cyanPrimary/20'
                }`}
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
            <Loader2 className="w-8 h-8 animate-spin text-cyanPrimary" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {projects?.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-cyanPrimary mb-4">No projects found</h3>
                <p className="text-cyanPrimary/70">
                  {activeFilter === 'all' 
                    ? 'No projects are available at the moment.' 
                    : `No ${activeFilter} projects found. Try a different filter.`}
                </p>
              </div>
            )}
            
            <div className="text-center scroll-reveal">
              <Button 
                className="bg-blueAccent hover:bg-blueAccent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
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
