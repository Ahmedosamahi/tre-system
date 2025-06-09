
import React, { useEffect, useState } from 'react';
import { useOnboardingContext } from './OnboardingProvider';
import { TourStep } from './TourStep';
import { tourSteps } from './tourSteps';

export const GuidedTour: React.FC = () => {
  const { state, nextTourStep, prevTourStep, completeTour, skipOnboarding } = useOnboardingContext();
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const currentStep = tourSteps[state.tourStepIndex];
  const isLastStep = state.tourStepIndex === tourSteps.length - 1;

  useEffect(() => {
    if (currentStep?.selector) {
      const element = document.querySelector(currentStep.selector) as HTMLElement;
      setHighlightedElement(element);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (isLastStep) {
      completeTour();
    } else {
      nextTourStep();
    }
  };

  const handlePrevious = () => {
    if (state.tourStepIndex > 0) {
      prevTourStep();
    }
  };

  if (!currentStep) {
    completeTour();
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none">
        {/* Spotlight effect for highlighted element */}
        {highlightedElement && (
          <div
            className="absolute border-4 border-blue-500 rounded-lg shadow-lg bg-white/10 pointer-events-none transition-all duration-300"
            style={{
              top: highlightedElement.offsetTop - 8,
              left: highlightedElement.offsetLeft - 8,
              width: highlightedElement.offsetWidth + 16,
              height: highlightedElement.offsetHeight + 16,
            }}
          />
        )}
      </div>

      {/* Tour Step Component */}
      <TourStep
        step={currentStep}
        stepNumber={state.tourStepIndex + 1}
        totalSteps={tourSteps.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={skipOnboarding}
        isLastStep={isLastStep}
        canGoBack={state.tourStepIndex > 0}
        highlightedElement={highlightedElement}
      />
    </>
  );
};
