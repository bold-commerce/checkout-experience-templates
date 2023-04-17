import React, {useEffect, useRef} from 'react';
import {useGetFlashErrors} from 'src/hooks';
import {actionRemoveError} from 'src/action';
import {IFlashErrorProps} from 'src/types';
import {useDispatch} from 'react-redux';

export function FlashError({type = 'flash'}: IFlashErrorProps): React.ReactElement {
    const errors = useGetFlashErrors(type);
    const dispatch = useDispatch();
    const rootRef = useRef<HTMLDivElement>(null);

    // Scrolls the rootRef into view when there are >= 1 flash errors
    useEffect(() => {
        if (!rootRef.current || !errors.length) {
            return; 
        }

        rootRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        });
    }, [errors]);

    return (
        <div className="flash-error" ref={rootRef}>
            {errors.map((item, index) =>
                <div key={`${item}-${index}`} className="flash-error__container">
                    <span aria-live="assertive" className="flash-error__text">{item.message}</span>
                    <button data-testid='delete-flash-error' className={'flash-error__delete-error'} onClick={() => {
                        dispatch(actionRemoveError(item.error));
                    }} aria-label="Delete Error"/>
                </div>
            )}
        </div>
    );

}
