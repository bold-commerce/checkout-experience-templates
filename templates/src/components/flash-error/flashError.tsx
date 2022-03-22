import React from 'react';
import {useGetFlashErrors} from 'src/hooks';

export function FlashError(): React.ReactElement {
    const errors = useGetFlashErrors();

    return (
        <div className={'flash-error'}>
            {
                errors && Array.isArray(errors) && errors.length > 0 && errors.map((item,  index ) => {
                    return (<div key={`flash-error-${index}`} className={'flash-error__container'}>
                        <span key={`flash-error-text-${index}`} className={'flash-error__text'}>{item}</span>
                    </div>);
                })
            }
        </div>
    );

}
