import { render, fireEvent } from '@testing-library/react';
import { SemiControlledNumberInput } from 'src/components';
import { ISemiControlledNumberInputProps } from 'src/types';

describe('Testing SemiControlledNumberInput component', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });
    
    test('component should render properly without error', () => {
        const props: ISemiControlledNumberInputProps = {
            value: 10,
            min: 1,
            disabled: false,
            onCommit: jest.fn(),
            className: 'test-class',
        };

        const { container, rerender } = render(<SemiControlledNumberInput {...props} />);
        const [ input ] = container.getElementsByClassName(props.className as string) as HTMLCollectionOf<HTMLInputElement>;
        expect(input).toBeTruthy();
        expect(input.type).toBe('number');
        expect(input.value).toBe(props.value.toString());
        expect(input.disabled).toBe(false);
        
        props.value = 100;
        props.disabled = true;
        rerender(<SemiControlledNumberInput {...props} />);
        expect(input.value).toBe(props.value.toString());
        expect(input.disabled).toBe(true);
    });

    test('onCommit should be called after on a delay after changing the value', () => {
        const props: ISemiControlledNumberInputProps = {
            value: 10,
            min: 1,
            disabled: false,
            onCommit: jest.fn(),
            className: 'test-class',
        };

        const { container } = render(<SemiControlledNumberInput {...props} />);
        const [ input ] = container.getElementsByClassName(props.className as string) as HTMLCollectionOf<HTMLInputElement>;

        fireEvent.change(input, {target: {value: '100'}});
        expect(props.onCommit).not.toHaveBeenCalled();
        jest.runAllTimers();
        expect(props.onCommit).toBeCalledTimes(1);
    });

    test('onCommit should be called only once after changing the value and blurring the input', () => {
        const props: ISemiControlledNumberInputProps = {
            value: 10,
            min: 1,
            disabled: false,
            onCommit: jest.fn(),
            className: 'test-class',
        };

        const { container } = render(<SemiControlledNumberInput {...props} />);
        const [ input ] = container.getElementsByClassName(props.className as string) as HTMLCollectionOf<HTMLInputElement>;

        fireEvent.change(input, {target: {value: '100'}});
        fireEvent.blur(input);

        expect(props.onCommit).toBeCalledTimes(1);
        jest.runAllTimers();
        expect(props.onCommit).toBeCalledTimes(1);
    });

    test('onCommit should be called only once after changing the value and waiting for the debounce', () => {
        let rerender: (...args: any) => void = () => undefined;
        const blurListener = jest.fn();
        // let input: HTMLInputElement;
        const props: ISemiControlledNumberInputProps = {
            value: 10,
            min: 1,
            disabled: false,
            onCommit: jest.fn(() => {
                props.disabled = true;
                rerender(<SemiControlledNumberInput {...props} />);
                fireEvent.blur(input);
            }),
            className: 'test-class',
        };

        const { container, rerender: _r } = render(<SemiControlledNumberInput {...props} />);
        const [ input ] = container.getElementsByClassName(props.className as string) as HTMLCollectionOf<HTMLInputElement>;
        input.addEventListener('blur', blurListener);
        rerender = _r;

        fireEvent.change(input, {target: {value: '100'}});
        expect(props.onCommit).toBeCalledTimes(0);
        jest.runAllTimers();
        expect(props.onCommit).toBeCalledTimes(1);
        expect(input.disabled).toBe(true);
        expect(blurListener).toBeCalledTimes(1);
    });

    test('component should respect min and max props', () => {
        const props: ISemiControlledNumberInputProps = {
            value: 10,
            min: 1,
            max: 100,
            disabled: false,
            onCommit: jest.fn(),
            className: 'test-class',
        };

        const { container } = render(<SemiControlledNumberInput {...props} />);
        const [ input ] = container.getElementsByClassName(props.className as string) as HTMLCollectionOf<HTMLInputElement>;

        // Testing number too high
        fireEvent.change(input, {target: {value: '100'}});
        fireEvent.blur(input);
        expect(props.onCommit).toBeCalledTimes(0);
        expect(input.value).toBe(props.value.toString());

        // Testing number too low
        fireEvent.change(input, {target: {value: '0'}});
        fireEvent.blur(input);
        expect(input.value).toBe(props.value.toString());
        expect(props.onCommit).toBeCalledTimes(0);

        // Testing just below max
        fireEvent.change(input, {target: {value: '99'}});
        fireEvent.blur(input);
        expect(props.onCommit).toBeCalledTimes(1);
        expect(props.onCommit).toBeCalledWith(99);
        expect(input.value).toBe('99');

        // Testing right at min
        fireEvent.change(input, {target: {value: '1'}});
        fireEvent.blur(input);
        expect(props.onCommit).toBeCalledTimes(2);
        expect(props.onCommit).toBeCalledWith(1);
        expect(input.value).toBe('1');
    });
});
