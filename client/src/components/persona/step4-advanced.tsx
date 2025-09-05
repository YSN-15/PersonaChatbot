import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface Step4Props {
  name: string;
  context: string;
  instructions: string;
  exampleDialogue: string;
  icebreakers: string[];
  onNameChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
  onExampleDialogueChange: (value: string) => void;
  onIcebreakersChange: (icebreakers: string[]) => void;
  onComplete: () => void;
  isLoading?: boolean;
}

const defaultIcebreakers = [
  "Aaj kya plans hai jaan? 😘",
  "Tell me something that made you smile today 💕",
  "Kya mood hai aaj? I want to hear everything 🔥",
  "What's keeping you busy these days, beautiful? 💋",
  "Batao, koi special someone hai life mein? 😉"
];

export default function Step4Advanced({
  name,
  context,
  instructions,
  exampleDialogue,
  icebreakers,
  onNameChange,
  onContextChange,
  onInstructionsChange,
  onExampleDialogueChange,
  onIcebreakersChange,
  onComplete,
  isLoading = false
}: Step4Props) {
  const [newIcebreaker, setNewIcebreaker] = useState("");

  const addIcebreaker = () => {
    if (newIcebreaker.trim()) {
      onIcebreakersChange([...icebreakers, newIcebreaker.trim()]);
      setNewIcebreaker("");
    }
  };

  const removeIcebreaker = (index: number) => {
    onIcebreakersChange(icebreakers.filter((_, i) => i !== index));
  };

  const addDefaultIcebreaker = (icebreaker: string) => {
    if (!icebreakers.includes(icebreaker)) {
      onIcebreakersChange([...icebreakers, icebreaker]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Advanced Settings</h2>
      </div>

      <div className="space-y-6">
        {/* AI Name */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            AI Name
          </label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="AI name (e.g., Priya, Asha, Riya, etc.)"
            className="bg-input border border-border text-foreground placeholder-muted-foreground"
            data-testid="input-ai-name"
          />
        </div>

        {/* Context */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Context
          </label>
          <Input
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="Context (e.g., Bollywood enthusiast, fitness influencer, fashion lover)"
            className="bg-input border border-border text-foreground placeholder-muted-foreground"
            data-testid="input-context"
          />
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            Instructions
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Specific instructions for how your AI should respond, language mix, conversation style
          </p>
          <Textarea
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            placeholder="e.g., Always mix Hindi and English, be flirty but respectful, use emojis often, maintain romantic tone..."
            className="min-h-20 bg-input border border-border text-foreground placeholder-muted-foreground resize-none"
            data-testid="input-instructions"
          />
        </div>

        {/* Example Dialogue */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            Example Dialogue
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Sample conversations to define your AI's unique style and personality
          </p>
          <Textarea
            value={exampleDialogue}
            onChange={(e) => onExampleDialogueChange(e.target.value)}
            placeholder="User: Hi!&#10;AI: Hey jaan! Kaise ho? Aaj bahut khush lag rahe ho 😘&#10;User: Good!&#10;AI: That's wonderful baby! Tell me about your day..."
            className="min-h-24 bg-input border border-border text-foreground placeholder-muted-foreground resize-none"
            data-testid="input-example-dialogue"
          />
        </div>

        {/* Icebreakers */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">
            Conversation Starters
          </h3>
          
          {/* Current Icebreakers */}
          <div className="space-y-2 mb-4" data-testid="icebreakers-list">
            {icebreakers.map((icebreaker, index) => (
              <div
                key={index}
                className="icebreaker-item bg-card border border-border rounded-lg p-3 flex items-center justify-between"
                data-testid={`icebreaker-${index}`}
              >
                <span className="text-sm text-foreground">"{icebreaker}"</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIcebreaker(index)}
                  className="text-red-500 hover:text-red-400 h-auto p-1"
                  data-testid={`button-remove-icebreaker-${index}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Icebreaker */}
          <div className="flex space-x-2 mb-4">
            <Input
              value={newIcebreaker}
              onChange={(e) => setNewIcebreaker(e.target.value)}
              placeholder="Add a conversation starter..."
              className="flex-1 bg-input border border-border text-foreground"
              onKeyPress={(e) => e.key === 'Enter' && addIcebreaker()}
              data-testid="input-new-icebreaker"
            />
            <Button
              onClick={addIcebreaker}
              variant="outline"
              className="border-border"
              data-testid="button-add-icebreaker"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Default Suggestions */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Quick add suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {defaultIcebreakers.filter(ice => !icebreakers.includes(ice)).map((icebreaker, index) => (
                <button
                  key={index}
                  onClick={() => addDefaultIcebreaker(icebreaker)}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
                  data-testid={`button-add-default-${index}`}
                >
                  + {icebreaker}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onComplete}
        disabled={isLoading}
        className="w-full animated-gradient text-white font-medium py-3 px-4 rounded-lg transition-all"
        data-testid="button-create-persona"
      >
        {isLoading ? "Creating AI Persona..." : "Create AI Persona"}
      </Button>
    </div>
  );
}
