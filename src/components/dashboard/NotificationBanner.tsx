
import React from 'react';

export const NotificationBanner = () => {
  return (
    <div className="bg-success-light p-4 rounded-lg mb-6 flex items-start">
      <div className="mr-3 mt-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12L10.5 14.5L16 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-green-800">
          Congratulations! Your account is now verified and you can request a pickup for your orders. 
          Pickups requested before 1 pm will be picked on the same day.
        </p>
      </div>
    </div>
  );
};

export default NotificationBanner;
