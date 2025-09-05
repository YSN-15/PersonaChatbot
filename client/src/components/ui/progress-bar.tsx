import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  return (
    <div className={cn("flex items-center space-x-2 w-full", className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        let stepClass = "h-1 flex-1 rounded-full transition-all duration-300";
        
        if (stepNumber < currentStep) {
          stepClass += " step-completed";
        } else if (stepNumber === currentStep) {
          stepClass += " step-active";
        } else {
          stepClass += " step-inactive";
        }
        
        return (
          <div
            key={stepNumber}
            className={stepClass}
            data-testid={`progress-step-${stepNumber}`}
          />
        );
      })}
    </div>
  );
}
