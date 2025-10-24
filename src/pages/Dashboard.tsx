import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LogOut, TrendingDown, Recycle, Droplet, Heart } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const categories = [
    { icon: TrendingDown, title: "Carbon Footprint", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Recycle, title: "Recycling", color: "text-green-600", bgColor: "bg-green-50" },
    { icon: Droplet, title: "Energy & Water", color: "text-cyan-600", bgColor: "bg-cyan-50" },
    { icon: Heart, title: "Habits", color: "text-pink-600", bgColor: "bg-pink-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <nav className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EcoTrack</span>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Track your sustainability journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`${category.bgColor} w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
                    <Icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>Track and monitor</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="secondary">
                    Add Activity
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;