import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {ISemiControlledNumberInputProps} from 'src/types';
import {useDebouncedCallback} from 'use-debounce';

export function SemiControlledNumberInput(props: ISemiControlledNumberInputProps): React.ReactElement {
    const {
        value,
        onCommit,
        ...inputProps
    } = props;
    const [localValue, setLocalValue] = useState(value);
    const ref = useRef<HTMLInputElement>(null);

    /**
     * Calls `onCommit` with the the passed value if the value is a valid number that is between
     * `props.min` (inclusive) and `props.max` (exclusive). If conditions fail, the tategt will have
     * its value set to `localValue`.
     */
    const commit = useCallback((value: number, target: HTMLInputElement) => {
        handleChange.cancel();
        if (
            isNaN(value) ||
            (props.min !== undefined && value < props.min) ||
            (props.max !== undefined && value >= props.max) ||
            localValue === value
        ) {
            target.value = localValue.toString();
            return;
        }

        /* istanbul ignore next */
        props.onCommit(value);
    }, [localValue, onCommit]);

    /**
     * Calls `commit` with the value of the event target
     */
    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        // To prevent firing commit when onBlur is called when the input is disabled. This could
        // happen when the user changes the value and remains on the same input for a while causing the debounce
        // to fire which will then disable the button and call onBlur.
        /* istanbul ignore next */
        if (ref.current?.disabled) {
            return; 
        }

        const value = parseInt(e.target.value, 10);
        commit(value, e.target);
    }, [commit]);

    /**
     * Calls `commit` after a delayed period with the value of the event target
     */
    const handleChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        commit(value, e.target);
    }, 3000);
            

    // Updating the local value when the props value changes
    useLayoutEffect(() => {
        setLocalValue(value);
        (ref.current as HTMLInputElement).value = value.toString();
    }, [value]);

    return (
        <input
            {...inputProps}
            value={undefined}
            defaultValue={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            type="number"
            ref={ref}
        />
    );
}