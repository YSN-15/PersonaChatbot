import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Step1Description from "@/components/persona/step1-description";
import Step2Personality from "@/components/persona/step2-personality";
import Step3Introduction from "@/components/persona/step3-introduction";
import Step4Advanced from "@/components/persona/step4-advanced";
import type { InsertPersona } from "@shared/schema";

export default function PersonaCreator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form state
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [introduction, setIntroduction] = useState("");
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [instructions, setInstructions] = useState("");
  const [exampleDialogue, setExampleDialogue] = useState("");
  const [icebreakers, setIcebreakers] = useState<string[]>([
    "Aaj kya plans hai jaan? 😘",
    "Tell me something that made you smile today 💕",
    "Kya mood hai aaj? I want to hear everything 🔥"
  ]);

  const createPersonaMutation = useMutation({
    mutationFn: async (personaData: InsertPersona) => {
      const response = await apiRequest("POST", "/api/personas", personaData);
      return response.json();
    },
    onSuccess: (persona) => {
      toast({
        title: "AI Persona Created! 🎉",
        description: `${persona.name} is ready to chat with you!`,
      });
      setLocation(`/chat/${persona.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI persona",
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completePersona = () => {
    const personaData: InsertPersona = {
      name: name || "My AI Influencer",
      description,
      role,
      traits,
      introduction,
      context,
      instructions,
      exampleDialogue,
      icebreakers,
      systemPrompt: "" // Will be generated on backend
    };

    createPersonaMutation.mutate(personaData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Description
            description={description}
            onDescriptionChange={setDescription}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2Personality
            role={role}
            traits={traits}
            onRoleChange={setRole}
            onTraitsChange={setTraits}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <Step3Introduction
            introduction={introduction}
            onIntroductionChange={setIntroduction}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <Step4Advanced
            name={name}
            context={context}
            instructions={instructions}
            exampleDialogue={exampleDialogue}
            icebreakers={icebreakers}
            onNameChange={setName}
            onContextChange={setContext}
            onInstructionsChange={setInstructions}
            onExampleDialogueChange={setExampleDialogue}
            onIcebreakersChange={setIcebreakers}
            onComplete={completePersona}
            isLoading={createPersonaMutation.isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <h1 className="text-xl font-semibold text-center flex-1">
            Create AI Persona
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Step Content */}
        <div className="step-content">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
