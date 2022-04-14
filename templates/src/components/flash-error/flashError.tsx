import React, { useEffect, useRef } from 'react';
import {useGetFlashErrors} from 'src/hooks';

export function FlashError(): React.ReactElement {
    const errors = useGetFlashErrors();
    const rootRef = useRef<HTMLDivElement>(null);

    // Scrolls the rootRef into view when there are >= 1 flash errors
    useEffect(() => {
        if (!rootRef.current || !errors.length) { return; }

        rootRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        });
    }, [errors]);

    return (
        <div className="flash-error" ref={rootRef}>
            {errors.map((item, index) =>
                <div key={`flash-error-${index}`} className="flash-error__container">
                    <span key={`flash-error-text-${index}`} className="flash-error__text">{item}</span>
                </div>
            )}
        </div>
    );

}
