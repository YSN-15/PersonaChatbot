import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Plus, MessageCircle, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Persona } from "@shared/schema";

export default function PersonaList() {
  const [, setLocation] = useLocation();

  // For now, we'll use a dummy userId since we don't have authentication yet
  const dummyUserId = "user123";

  // Fetch all personas
  const { data: personas, isLoading } = useQuery<Persona[]>({
    queryKey: ["/api/users", dummyUserId, "personas"],
    queryFn: async () => {
      // Since we don't have user auth yet, let's fetch all personas
      const response = await fetch('/api/personas/all');
      if (!response.ok) {
        throw new Error('Failed to fetch personas');
      }
      return response.json();
    },
  });

  const createNewPersona = () => {
    setLocation("/create");
  };

  const chatWithPersona = (personaId: string) => {
    setLocation(`/chat/${personaId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-foreground">Loading your AI companions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">InfluBee</h1>
          </div>
          <p className="text-muted-foreground">
            Your AI influencer companions await you
          </p>
        </div>

        {/* Create New Persona Button */}
        <div className="mb-8">
          <Button
            onClick={createNewPersona}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            data-testid="button-create-new-persona"
          >
            <Plus className="h-5 w-5" />
            <span>Create New AI Persona</span>
          </Button>
        </div>

        {/* Personas Grid */}
        {personas && personas.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {personas.map((persona) => (
              <Card
                key={persona.id}
                className="bg-card/80 backdrop-blur-sm border border-border hover:border-primary transition-all cursor-pointer group"
                onClick={() => chatWithPersona(persona.id)}
                data-testid={`persona-card-${persona.id}`}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Persona Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {persona.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{persona.role}</p>
                      </div>
                      <MessageCircle className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground line-clamp-3">
                      {persona.description}
                    </p>

                    {/* Traits */}
                    <div className="flex flex-wrap gap-2">
                      {persona.traits.slice(0, 3).map((trait, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                          data-testid={`trait-${index}`}
                        >
                          {trait}
                        </span>
                      ))}
                      {persona.traits.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                          +{persona.traits.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Sample Introduction */}
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground italic">
                        "{persona.introduction}"
                      </p>
                    </div>

                    {/* Chat Button */}
                    <Button
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      data-testid={`button-chat-${persona.id}`}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chatting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              No AI personas yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first seductive AI influencer companion
            </p>
            <Button
              onClick={createNewPersona}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-create-first-persona"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First AI
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}