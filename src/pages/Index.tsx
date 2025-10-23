import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, TrendingDown, Recycle, Droplet, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <nav className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EcoTrack</span>
          </div>
          <Link to="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Track Your Environmental Impact
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Monitor your carbon footprint, recycling habits, energy usage, and sustainable lifestyle choices all in one place
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8">
              Start Tracking Today
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: TrendingDown, title: "Carbon Footprint", desc: "Calculate and reduce emissions" },
            { icon: Recycle, title: "Recycling", desc: "Track recycling activities" },
            { icon: Droplet, title: "Energy & Water", desc: "Monitor resource usage" },
            { icon: Heart, title: "Habits", desc: "Build sustainable routines" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-card p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <Icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
