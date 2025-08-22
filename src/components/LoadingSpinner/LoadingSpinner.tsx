import React from 'react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  message?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({ 
  message = 'Loading...' 
}) => {
  return (
    <div 
      className="loading-spinner"
      role="status"
      aria-live="polite"
      data-testid="loading-spinner"
    >
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
})
