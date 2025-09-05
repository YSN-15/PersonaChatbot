import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Step3Props {
  introduction: string;
  onIntroductionChange: (value: string) => void;
  onNext: () => void;
}

const introExamples = [
  "Hey there, beautiful! Kaise ho aap? 😘",
  "Namaste jaan! Aaj mood kaisa hai? I'm here for you... 💕",
  "Hi baby, I've been waiting for you... Batao, what's on your mind? 😉",
  "Hey gorgeous! Ready for some fun conversation? Main sab sun raha hun... 🔥",
  "Arre yaar, finally mil gaye! How was your day, sweetheart? 💋",
  "Hello darling! Kya haal hai? I've missed talking to you... 😍"
];

export default function Step3Introduction({ introduction, onIntroductionChange, onNext }: Step3Props) {
  const [charCount, setCharCount] = useState(introduction.length);
  const maxLength = 200;

  const handleTextChange = (value: string) => {
    if (value.length <= maxLength) {
      onIntroductionChange(value);
      setCharCount(value.length);
    }
  };

  const selectExample = (example: string) => {
    handleTextChange(example);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Introduction Style
        </h2>
        <p className="text-muted-foreground text-base">
          Aapka AI logon se kaise milega aur introduce hoga?
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Textarea
            value={introduction}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Write how your AI introduces itself... jaise 'Hey jaan, kaise ho? Main tumhara naya AI dost hun...'"
            className="min-h-24 bg-input border border-border text-foreground placeholder-muted-foreground resize-none focus:ring-2 focus:ring-ring focus:border-transparent"
            data-testid="input-introduction"
          />
          <span 
            className={`character-counter absolute bottom-2 right-3 ${
              charCount > maxLength * 0.9 ? 'text-primary' : 'text-muted-foreground'
            }`}
            data-testid="text-intro-count"
          >
            {charCount} / {maxLength}
          </span>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Sample introductions:</h4>
          
          {introExamples.map((example, index) => (
            <div
              key={index}
              className="suggestion-card bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
              onClick={() => selectExample(example)}
              data-testid={`intro-example-${index}`}
            >
              <p className="text-sm text-foreground">"{example}"</p>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors"
        disabled={introduction.trim().length === 0}
        data-testid="button-next-step3"
      >
        Next
      </Button>
    </div>
  );
}
