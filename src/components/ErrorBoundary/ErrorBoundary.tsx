import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidMount() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
    
    // Catch global JavaScript errors
    window.addEventListener('error', this.handleGlobalError)
    
    // Catch async errors in event handlers
    window.addEventListener('error', this.handleAsyncError, true)
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
    window.removeEventListener('error', this.handleGlobalError)
    window.removeEventListener('error', this.handleAsyncError, true)
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // Convert promise rejection to Error object if it isn't already
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason))
    
    this.setState({ 
      hasError: true, 
      error,
      errorInfo: { componentStack: 'Promise Rejection' } as ErrorInfo
    })
    
    // Prevent the default browser behavior
    event.preventDefault()
  }

  handleGlobalError = (event: ErrorEvent) => {
    console.error('Global JavaScript error:', event.error)
    
    // Don't catch errors from our own error boundary to avoid infinite loops
    if (event.error?.message?.includes('ErrorBoundary')) {
      return
    }
    
    this.setState({ 
      hasError: true, 
      error: event.error || new Error(event.message),
      errorInfo: { componentStack: 'Global Error' } as ErrorInfo
    })
    
    // Prevent the default browser behavior
    event.preventDefault()
  }

  handleAsyncError = (event: ErrorEvent) => {
    // Catch async errors that might occur in event handlers
    if (event.error && !this.state.hasError) {
      console.error('Async error caught:', event.error)
      this.setState({ 
        hasError: true, 
        error: event.error,
        errorInfo: { componentStack: 'Async Error' } as ErrorInfo
      })
    }
  }

  // Enhanced error boundary for async operations
  static asyncErrorBoundary = <T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args)
      } catch (error) {
        console.error('Async error in boundary:', error)
        // Re-throw to let the error boundary catch it
        throw error
      }
    }
  }

  handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error
      const errorInfo = this.state.errorInfo
      
      return (
        <div className="error-boundary" role="alert">
          <h2>Something went wrong</h2>
          <p>An error occurred while running this application.</p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>Error Details (Development)</summary>
              <div className="error-stack">
                <strong>Error:</strong> {error?.message}
                {errorInfo?.componentStack && (
                  <pre className="component-stack">
                    {errorInfo.componentStack}
                  </pre>
                )}
                {error?.stack && (
                  <pre className="error-stack-trace">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}
          
          <div className="error-actions">
            <button 
              onClick={() => window.location.reload()} 
              className="reload-button"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
