
import { useState, useEffect } from 'react';

export interface UserSetupData {
  businessName: string;
  contactPhone: string;
  pickupAddress: string;
  preferredCourier: string;
  sameDayDelivery: boolean;
}

export interface OnboardingState {
  isCompleted: boolean;
  currentStep: 'setup' | 'tour' | 'completed';
  tourStepIndex: number;
  userSetupData: UserSetupData | null;
}

const STORAGE_KEY = 'tredo-onboarding-status';

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          isCompleted: false,
          currentStep: 'setup',
          tourStepIndex: 0,
          userSetupData: null,
        };
      }
    }
    return {
      isCompleted: false,
      currentStep: 'setup',
      tourStepIndex: 0,
      userSetupData: null,
    };
  });

  const updateState = (newState: Partial<OnboardingState>) => {
    const updatedState = { ...state, ...newState };
    setState(updatedState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
  };

  const completeSetup = (setupData: UserSetupData) => {
    updateState({
      userSetupData: setupData,
      currentStep: 'tour',
    });
  };

  const nextTourStep = () => {
    updateState({
      tourStepIndex: state.tourStepIndex + 1,
    });
  };

  const prevTourStep = () => {
    updateState({
      tourStepIndex: Math.max(0, state.tourStepIndex - 1),
    });
  };

  const completeTour = () => {
    updateState({
      isCompleted: true,
      currentStep: 'completed',
    });
  };

  const skipOnboarding = () => {
    updateState({
      isCompleted: true,
      currentStep: 'completed',
    });
  };

  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      isCompleted: false,
      currentStep: 'setup',
      tourStepIndex: 0,
      userSetupData: null,
    });
  };

  return {
    state,
    completeSetup,
    nextTourStep,
    prevTourStep,
    completeTour,
    skipOnboarding,
    resetOnboarding,
  };
};
