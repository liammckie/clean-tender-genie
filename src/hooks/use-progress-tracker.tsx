
import { useState } from 'react';

export interface ProgressStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  description?: string;
}

export function useProgressTracker(initialSteps: ProgressStep[]) {
  const [steps, setSteps] = useState<ProgressStep[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const updateStepStatus = (stepId: string, status: ProgressStep['status']) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const nextStep = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  };

  const previousStep = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (index: number) => {
    setCurrentStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
  };

  const resetProgress = () => {
    setSteps(prevSteps =>
      prevSteps.map(step => ({ ...step, status: 'pending' }))
    );
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const completedStepsCount = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedStepsCount / steps.length) * 100;

  return {
    steps,
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    completedStepsCount,
    progressPercentage,
    updateStepStatus,
    nextStep,
    previousStep,
    goToStep,
    resetProgress,
  };
}
