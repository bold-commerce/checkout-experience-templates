import React, {ErrorInfo} from 'react';
import {BreadcrumbType} from '@bugsnag/js';

export interface IBreadcrumbTypes {
    readonly error: BreadcrumbType;
    readonly log: BreadcrumbType;
    readonly manual: BreadcrumbType;
    readonly navigation: BreadcrumbType;
    readonly process: BreadcrumbType;
    readonly request: BreadcrumbType;
    readonly state: BreadcrumbType;
    readonly user: BreadcrumbType;
}

export interface IErrorBoundaryState {
    error: Error | null,
    errorInfo: ErrorInfo | null
}

export interface IErrorBoundaryProps {
    fallbackComponent?: React.FunctionComponent<IErrorBoundaryState>
}

export interface IMetadata {[key: string]: unknown}

export type IMetadataList = [{section: string, values: IMetadata}]
