import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface Step1Props {
  description: string;
  onDescriptionChange: (value: string) => void;
  onNext: () => void;
}

const suggestions = [
  "A charming influencer jo romantic conversations mein expert hai aur logon ko feel special karati hai with sweet Hindi-English mix",
  "A seductive AI companion jo flirty banter aur intimate conversations create karta hai, making every chat feel personal aur exciting",
  "A glamorous social media queen jo fashion aur lifestyle ke saath-saath romantic talks mein bhi expert hai",
  "A mysterious beauty jo deep conversations aur emotional connection banane mein skilled hai with perfect desi touch"
];

export default function Step1Description({ description, onDescriptionChange, onNext }: Step1Props) {
  const [charCount, setCharCount] = useState(description.length);
  const maxLength = 2000;

  const handleTextChange = (value: string) => {
    if (value.length <= maxLength) {
      onDescriptionChange(value);
      setCharCount(value.length);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    handleTextChange(suggestion);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Apne AI ke baare mein batayiye
        </h2>
        <p className="text-muted-foreground text-base">
          What makes your influencer persona unique aur special?
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Textarea
            value={description}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Describe your AI influencer persona... jaise ki aap kya specialty hai, kaise baat karte ho, aur kya makes you attractive aur engaging..."
            className="min-h-32 bg-input border border-border text-foreground placeholder-muted-foreground resize-none focus:ring-2 focus:ring-ring focus:border-transparent"
            data-testid="input-description"
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add media</span>
            </div>
            <span 
              className={`character-counter ${charCount > maxLength * 0.9 ? 'text-primary' : 'text-muted-foreground'}`}
              data-testid="text-char-count"
            >
              {charCount} / {maxLength}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-card bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
              onClick={() => selectSuggestion(suggestion)}
              data-testid={`suggestion-${index}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${index % 2 === 0 ? 'bg-primary' : 'bg-accent'}`} />
                <p className="text-sm text-foreground">{suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors"
        disabled={description.trim().length === 0}
        data-testid="button-next-step1"
      >
        Next
      </Button>
    </div>
  );
}
