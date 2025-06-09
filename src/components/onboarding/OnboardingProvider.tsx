
import React, { createContext, useContext } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { StepOneModal } from './StepOneModal';
import { GuidedTour } from './GuidedTour';

interface OnboardingContextType {
  state: ReturnType<typeof useOnboarding>['state'];
  completeSetup: ReturnType<typeof useOnboarding>['completeSetup'];
  nextTourStep: ReturnType<typeof useOnboarding>['nextTourStep'];
  prevTourStep: ReturnType<typeof useOnboarding>['prevTourStep'];
  completeTour: ReturnType<typeof useOnboarding>['completeTour'];
  skipOnboarding: ReturnType<typeof useOnboarding>['skipOnboarding'];
  resetOnboarding: ReturnType<typeof useOnboarding>['resetOnboarding'];
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const onboarding = useOnboarding();

  return (
    <OnboardingContext.Provider value={onboarding}>
      {children}
      
      {/* Step 1: User Setup Modal */}
      {!onboarding.state.isCompleted && onboarding.state.currentStep === 'setup' && (
        <StepOneModal />
      )}
      
      {/* Step 2: Guided Tour */}
      {!onboarding.state.isCompleted && onboarding.state.currentStep === 'tour' && (
        <GuidedTour />
      )}
    </OnboardingContext.Provider>
  );
};
