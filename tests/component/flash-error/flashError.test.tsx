import {fireEvent, getByTestId, render, screen} from '@testing-library/react';
import { FlashError } from 'src/components';
import { mocked } from 'jest-mock';
import { useGetFlashErrors } from 'src/hooks';
import {IError} from 'src/types';

const mockDispatch = jest.fn();
jest.mock('src/hooks/useGetFlashErrors');
const useGetFlashErrorsMock = mocked(useGetFlashErrors, true);
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

// scrollIntoView is not implemented in jsdom which jest uses. So we just stub it.
// https://github.com/jsdom/jsdom/issues/1695
const scrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

describe('Testing FlashError component', () => {

    const error: IError = {
        message: 'error message',
        type: 'test-type',
        field: 'test',
        severity: 'validation',
        sub_type: '',
    };

    const dataArray = [
        {
            name: 'Render with only one error',
            mockedReturnValue: [{message: 'error', error: error}],
            flashErrorCount: 1,
            flashErrorContainerCount: 1,
            flashErrorTextCount: 1,
            shouldScollIntoView: true,
        },
        {
            name: 'Render with no error',
            mockedReturnValue: [],
            flashErrorCount: 1,
            flashErrorContainerCount: 0,
            flashErrorTextCount: 0,
            shouldScollIntoView: false,
        },
        {
            name: 'Render with multiple error',
            mockedReturnValue: [{message: 'error', error: error}, {message: 'error-2', error: error}],
            flashErrorCount: 1,
            flashErrorContainerCount: 2,
            flashErrorTextCount: 2,
            shouldScollIntoView: true,
        },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test.each(dataArray)( '$name', async ({mockedReturnValue, flashErrorCount, flashErrorContainerCount, flashErrorTextCount, shouldScollIntoView}) => {
        useGetFlashErrorsMock.mockReturnValueOnce(mockedReturnValue);
        const {container} = render(<FlashError/>);
        expect(container.getElementsByClassName('flash-error').length).toBe(flashErrorCount);
        expect(container.getElementsByClassName('flash-error__container').length).toBe(flashErrorContainerCount);
        expect(container.getElementsByClassName('flash-error__text').length).toBe(flashErrorTextCount);
        expect(scrollIntoView).toHaveBeenCalledTimes(shouldScollIntoView ? 1 : 0);
    });

    test('verifying the click event', () => {

        useGetFlashErrorsMock.mockReturnValueOnce([{message: 'error', error: error}]);
        render(<FlashError/>);
        const element = screen.getByTestId('delete-flash-error');
        fireEvent.click(element);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    })

});
