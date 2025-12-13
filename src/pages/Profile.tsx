import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  User,
  CreditCard,
  History,
  Settings,
  ArrowLeft,
  Coins,
  Star,
  Crown,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  target_score: number | null;
  current_level: string | null;
}

interface UserCredits {
  total_credits: number;
  used_credits: number;
  subscription_tier: string;
  subscription_expires_at: string | null;
}

interface Purchase {
  id: string;
  amount: number;
  credits_purchased: number;
  payment_method: string | null;
  status: string;
  created_at: string;
}

const creditPackages = [
  { credits: 50, price: 4.99, popular: false },
  { credits: 150, price: 12.99, popular: true },
  { credits: 500, price: 39.99, popular: false },
];

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [formData, setFormData] = useState({
    full_name: "",
    target_score: 65,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("user_profiles_2025_12_01_12_35")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || "",
          target_score: profileData.target_score || 65,
        });
      }

      // Fetch credits
      const { data: creditsData } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (creditsData) {
        setCredits(creditsData);
      }

      // Fetch purchase history
      const { data: purchasesData } = await supabase
        .from("purchase_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (purchasesData) {
        setPurchases(purchasesData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("user_profiles_2025_12_01_12_35")
        .update({
          full_name: formData.full_name,
          target_score: formData.target_score,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const remainingCredits = credits ? credits.total_credits - credits.used_credits : 0;
  const creditsUsedPercentage = credits ? (credits.used_credits / credits.total_credits) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-border px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">PedagogistPTE</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl">
                {formData.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {formData.full_name || "User"}
              </h1>
              <p className="text-muted-foreground">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="gap-1">
                  <Crown className="w-3 h-3" />
                  {credits?.subscription_tier === "free" ? "Free Plan" : "VIP Member"}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Coins className="w-3 h-3" />
                  {remainingCredits} Credits
                </Badge>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Billing & Credits
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                Purchase History
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profile?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetScore">Target PTE Score</Label>
                      <Input
                        id="targetScore"
                        type="number"
                        min={10}
                        max={90}
                        value={formData.target_score}
                        onChange={(e) => setFormData({ ...formData, target_score: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              {/* Credits Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-accent" />
                    Credits Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-foreground">{remainingCredits}</p>
                      <p className="text-sm text-muted-foreground">Credits remaining</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-muted-foreground">
                        {credits?.used_credits} / {credits?.total_credits}
                      </p>
                      <p className="text-sm text-muted-foreground">Used</p>
                    </div>
                  </div>
                  <Progress value={creditsUsedPercentage} className="h-2" />
                </CardContent>
              </Card>

              {/* Buy Credits */}
              <Card>
                <CardHeader>
                  <CardTitle>Buy More Credits</CardTitle>
                  <CardDescription>Select a package to purchase</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {creditPackages.map((pkg) => (
                      <div
                        key={pkg.credits}
                        className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:border-accent ${
                          pkg.popular ? "border-accent" : "border-border"
                        }`}
                      >
                        {pkg.popular && (
                          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent">
                            Most Popular
                          </Badge>
                        )}
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-3xl font-bold text-foreground mb-2">
                            <Coins className="w-6 h-6 text-accent" />
                            {pkg.credits}
                          </div>
                          <p className="text-muted-foreground mb-4">Credits</p>
                          <p className="text-2xl font-bold text-accent">${pkg.price}</p>
                          <Button variant="hero" className="w-full mt-4">
                            Purchase
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    VIP Subscription
                  </CardTitle>
                  <CardDescription>Unlock unlimited practice with VIP</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Go VIP</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Unlimited practice questions
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            AI-powered scoring & feedback
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Full mock test access
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Priority support
                          </li>
                        </ul>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-foreground">$29.99</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                        <Button variant="hero" className="mt-4">
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>Your recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {purchases.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No purchases yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchases.map((purchase) => (
                        <div
                          key={purchase.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                              <Coins className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {purchase.credits_purchased} Credits
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(purchase.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-foreground">${purchase.amount / 100}</p>
                            <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                              {purchase.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
