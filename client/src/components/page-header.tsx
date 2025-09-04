import ParticleBackground from "@/components/particle-background";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden py-20 text-center">
      <ParticleBackground />
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
