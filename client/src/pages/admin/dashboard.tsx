import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function DashboardPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [category, setCategory] = useState("web");
  const [technologies, setTechnologies] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("longDescription", longDescription);
    formData.append("category", category);
    formData.append("technologies", technologies);
    formData.append("demoUrl", demoUrl);
    formData.append("githubUrl", githubUrl);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Project Uploaded",
          description: "Your new project has been added successfully.",
        });
        // Clear form
        setTitle("");
        setDescription("");
        setLongDescription("");
        setCategory("web");
        setTechnologies("");
        setImageUrl("");
        setDemoUrl("");
        setGithubUrl("");
        setImageFile(null);
      } else {
        const errorData = await response.json();
        toast({
          title: "Upload Failed",
          description: errorData.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <div className="bg-card p-8 rounded-2xl shadow-lg border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">
            Upload New Project
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="design">Design</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea id="longDescription" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input id="technologies" value={technologies} onChange={(e) => setTechnologies(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input id="demoUrl" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Project"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
