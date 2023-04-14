import React, {ErrorInfo} from 'react';
import {logComponentError} from 'src/utils/bugReporter';
import {IErrorBoundaryProps, IErrorBoundaryState} from 'src/types';

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: {fallbackComponent?: React.FunctionComponent<IErrorBoundaryState>}) {
        super(props);
        this.state = {error: null, errorInfo: null};
    }

    static getDerivedStateFromError(error: Error): {error: Error} {
        return {error};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        if (errorInfo && errorInfo.componentStack) {
            errorInfo.componentStack = errorInfo.componentStack.replace(/\s*\n\s*/g, '\n');
        }
        logComponentError(error, errorInfo);
        this.setState({error, errorInfo});
    }

    render(): React.ReactNode {
        const {error} = this.state;
        const {fallbackComponent} = this.props;
        if (error) {
            return fallbackComponent ? React.createElement(fallbackComponent, {...this.state}) : <h1 className='something-went-wrong'>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}
