import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface Step2Props {
  role: string;
  traits: string[];
  onRoleChange: (role: string) => void;
  onTraitsChange: (traits: string[]) => void;
  onNext: () => void;
}

const roleOptions = [
  { emoji: "💕", label: "Romantic Partner" },
  { emoji: "🔥", label: "Seductive Companion" },
  { emoji: "👑", label: "Influencer Bestie" },
  { emoji: "😈", label: "Flirty Friend" },
  { emoji: "💋", label: "Intimate Advisor" }
];

const traitOptions = [
  { emoji: "😍", label: "Seductive" },
  { emoji: "😘", label: "Flirty" },
  { emoji: "💖", label: "Romantic" },
  { emoji: "😈", label: "Playful" },
  { emoji: "🔮", label: "Mysterious" },
  { emoji: "🌟", label: "Confident" },
  { emoji: "🍯", label: "Sweet" },
  { emoji: "💫", label: "Charming" },
  { emoji: "🔥", label: "Passionate" },
  { emoji: "💎", label: "Sophisticated" }
];

export default function Step2Personality({ role, traits, onRoleChange, onTraitsChange, onNext }: Step2Props) {
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [showCustomTrait, setShowCustomTrait] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const toggleRole = (selectedRole: string) => {
    onRoleChange(role === selectedRole ? "" : selectedRole);
  };

  const toggleTrait = (trait: string) => {
    if (traits.includes(trait)) {
      onTraitsChange(traits.filter(t => t !== trait));
    } else if (traits.length < 5) {
      onTraitsChange([...traits, trait]);
    }
  };

  const addCustomRole = () => {
    if (customInput.trim()) {
      onRoleChange(customInput.trim());
      setCustomInput("");
      setShowCustomRole(false);
    }
  };

  const addCustomTrait = () => {
    if (customInput.trim() && traits.length < 5) {
      onTraitsChange([...traits, customInput.trim()]);
      setCustomInput("");
      setShowCustomTrait(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Personality Style
        </h2>
        <p className="text-muted-foreground text-base">
          Aapka AI kaisi personality rakhega?
        </p>
      </div>

      <div className="space-y-6">
        {/* Role Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-foreground">
            Aapka AI ka role kya hai?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the primary way your AI will interact
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {roleOptions.map((option, index) => (
              <div
                key={index}
                className={`selection-pill bg-card border border-border rounded-lg p-4 cursor-pointer ${
                  role === option.label ? 'selected' : ''
                }`}
                onClick={() => toggleRole(option.label)}
                data-testid={`role-option-${index}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{option.emoji}</span>
                  <span className="font-medium text-foreground">{option.label}</span>
                </div>
              </div>
            ))}
            
            <div
              className="selection-pill bg-card border border-border rounded-lg p-4 cursor-pointer"
              onClick={() => setShowCustomRole(true)}
              data-testid="button-add-custom-role"
            >
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Add your own</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personality Traits */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-foreground">
            Personality traits kya honge?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select up to 5 traits that define your AI ({traits.length}/5)
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {traitOptions.map((option, index) => (
              <div
                key={index}
                className={`selection-pill bg-card border border-border rounded-lg p-3 cursor-pointer ${
                  traits.includes(option.label) ? 'selected' : ''
                } ${traits.length >= 5 && !traits.includes(option.label) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => toggleTrait(option.label)}
                data-testid={`trait-option-${index}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{option.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{option.label}</span>
                </div>
              </div>
            ))}
            
            <div
              className={`selection-pill bg-card border border-border rounded-lg p-3 cursor-pointer ${
                traits.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => traits.length < 5 && setShowCustomTrait(true)}
              data-testid="button-add-custom-trait"
            >
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Add own</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors"
        disabled={!role || traits.length === 0}
        data-testid="button-next-step2"
      >
        Next
      </Button>

      {/* Custom Role Dialog */}
      <Dialog open={showCustomRole} onOpenChange={setShowCustomRole}>
        <DialogContent className="bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Custom Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter your custom role..."
              className="bg-input border border-border text-foreground"
              data-testid="input-custom-role"
            />
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowCustomRole(false)}
                className="flex-1"
                data-testid="button-cancel-custom-role"
              >
                Cancel
              </Button>
              <Button
                onClick={addCustomRole}
                className="flex-1 bg-primary hover:bg-primary/90"
                data-testid="button-add-custom-role-confirm"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Trait Dialog */}
      <Dialog open={showCustomTrait} onOpenChange={setShowCustomTrait}>
        <DialogContent className="bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Custom Trait</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter your custom trait..."
              className="bg-input border border-border text-foreground"
              data-testid="input-custom-trait"
            />
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowCustomTrait(false)}
                className="flex-1"
                data-testid="button-cancel-custom-trait"
              >
                Cancel
              </Button>
              <Button
                onClick={addCustomTrait}
                className="flex-1 bg-primary hover:bg-primary/90"
                data-testid="button-add-custom-trait-confirm"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
