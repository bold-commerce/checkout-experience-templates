import {render} from '@testing-library/react';
import React from 'react';
import {ErrorBoundary} from 'src/components';
import * as Store from 'src/store';
import {storeMock} from 'src/mocks';

jest.mock('src/utils/bugReporter');
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));


describe('Test ErrorBoundary', () => {
    const store = Store.initializeStore();
    const ThrowError = () => {
        throw new Error('Test');
    };

    test('ErrorBoundary no error, no fallback, load children', () => {
        const component =
                <ErrorBoundary>
                    <div className='test-children'/>
                </ErrorBoundary>;
        const {container} = render(component);
        expect(container.getElementsByClassName('test-children').length).toBe(1);
    });

    test('ErrorBoundary error, no fallback, load h1 something-went-wrong', () => {
        jest.spyOn(console, 'error')
            .mockImplementationOnce(() => {/*Silence expected console error*/})
            .mockImplementationOnce(() => {/*Silence expected console error*/});
        const component =
            <ErrorBoundary>
                <ThrowError/>
            </ErrorBoundary>;
        const {container} = render(component);
        expect(container.getElementsByClassName('test-children').length).toBe(0);
        expect(container.getElementsByClassName('something-went-wrong').length).toBe(1);
    });

    test('ErrorBoundary error, load fallback', () => {
        jest.spyOn(console, 'error')
            .mockImplementationOnce(() => {/*Silence expected console error*/})
            .mockImplementationOnce(() => {/*Silence expected console error*/});
        const FallbackTest = () => <h1 className='fallback-test'>Another thing went wrong</h1>;
        const component =
            <ErrorBoundary fallbackComponent={FallbackTest}>
                <ThrowError/>
            </ErrorBoundary>;
        const {container} = render(component);
        expect(container.getElementsByClassName('test-children').length).toBe(0);
        expect(container.getElementsByClassName('something-went-wrong').length).toBe(0);
        expect(container.getElementsByClassName('fallback-test').length).toBe(1);
    });
});
