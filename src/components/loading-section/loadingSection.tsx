import {ILoadingSectionProps} from 'src/types';
import React from 'react';
import {LoadSpinner} from 'src/components';

export function LoadingSection(props: ILoadingSectionProps): React.ReactElement{

    return (
        <>
            {
                props.isLoading && <div className={props.className}>
                    <LoadSpinner/>
                </div>
            }
        </>
    );
}
