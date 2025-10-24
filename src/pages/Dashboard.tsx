import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LogOut, TrendingDown, Recycle, Droplet, Heart } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activityValue, setActivityValue] = useState("");
  const [activityDescription, setActivityDescription] = useState("");

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

  const handleAddActivity = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
  };

  const handleSaveActivity = async () => {
    if (!activityValue || !selectedCategory) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Check if the activities table exists, if not, create it
      const { data, error } = await supabase
        .from('activities')
        .insert([
          {
            user_id: user.id,
            category: selectedCategory,
            value: parseFloat(activityValue),
            description: activityDescription,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      toast.success(`${selectedCategory} activity added successfully!`);
      setSelectedCategory(null);
      setActivityValue("");
      setActivityDescription("");
    } catch (error: any) {
      console.error('Error saving activity:', error);
      toast.error(error.message || "Failed to save activity");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const categories = [
    { icon: TrendingDown, title: "Carbon Footprint", color: "text-blue-600", bgColor: "bg-blue-50", unit: "kg CO2" },
    { icon: Recycle, title: "Recycling", color: "text-green-600", bgColor: "bg-green-50", unit: "kg" },
    { icon: Droplet, title: "Energy & Water", color: "text-cyan-600", bgColor: "bg-cyan-50", unit: "kWh/L" },
    { icon: Heart, title: "Habits", color: "text-pink-600", bgColor: "bg-pink-50", unit: "count" },
  ];

  const getUnitForCategory = (categoryTitle: string) => {
    const category = categories.find(c => c.title === categoryTitle);
    return category?.unit || "units";
  };

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
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    onClick={() => handleAddActivity(category.title)}
                  >
                    Add Activity
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Activity Dialog */}
      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {selectedCategory} Activity</DialogTitle>
            <DialogDescription>
              Record your {selectedCategory?.toLowerCase()} data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value ({selectedCategory ? getUnitForCategory(selectedCategory) : ""})</Label>
              <Input
                id="value"
                type="number"
                placeholder="Enter value"
                value={activityValue}
                onChange={(e) => setActivityValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add notes about this activity"
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSelectedCategory(null)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveActivity} className="flex-1">
              Save Activity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
