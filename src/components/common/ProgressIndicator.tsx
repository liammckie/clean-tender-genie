
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

const ProgressIndicator = ({ totalSteps, currentStep, completedSteps = [], className }: ProgressIndicatorProps) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(stepNumber) || stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2",
              isCompleted && "bg-green-500 border-green-500 text-white",
              isCurrent && !isCompleted && "border-blue-500 text-blue-500",
              !isCompleted && !isCurrent && "border-gray-300 text-gray-300"
            )}>
              {isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>
            {stepNumber < totalSteps && (
              <div className={cn(
                "w-8 h-0.5 mx-2",
                stepNumber < currentStep ? "bg-green-500" : "bg-gray-300"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;
