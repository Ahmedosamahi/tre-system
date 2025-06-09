
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface TourStepData {
  id: string;
  title: string;
  description: string;
  selector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TourStepProps {
  step: TourStepData;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  isLastStep: boolean;
  canGoBack: boolean;
  highlightedElement: HTMLElement | null;
}

export const TourStep: React.FC<TourStepProps> = ({
  step,
  stepNumber,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  isLastStep,
  canGoBack,
  highlightedElement,
}) => {
  const progress = (stepNumber / totalSteps) * 100;

  const getTooltipPosition = () => {
    if (!highlightedElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = highlightedElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    let top = rect.top;
    let left = rect.left;

    switch (step.position) {
      case 'top':
        top = rect.top - tooltipHeight - 20;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - 20;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + 20;
        break;
    }

    // Ensure tooltip stays within viewport
    if (left < 20) left = 20;
    if (left + tooltipWidth > window.innerWidth - 20) left = window.innerWidth - tooltipWidth - 20;
    if (top < 20) top = 20;
    if (top + tooltipHeight > window.innerHeight - 20) top = window.innerHeight - tooltipHeight - 20;

    return { top: `${top}px`, left: `${left}px` };
  };

  return (
    <Card
      className="fixed z-[60] w-80 p-6 pointer-events-auto animate-scale-in"
      style={getTooltipPosition()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-600">
            Step {stepNumber} of {totalSteps}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onSkip}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="mb-4" />

      {/* Content */}
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-semibold">{step.title}</h3>
        <p className="text-sm text-gray-600">{step.description}</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onSkip}>
            Skip Tour
          </Button>
          <Button onClick={onNext} className="flex items-center gap-2">
            {isLastStep ? 'Finish' : 'Next'}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};
