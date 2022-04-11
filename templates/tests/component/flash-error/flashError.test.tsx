import { render } from '@testing-library/react';
import { FlashError } from 'src/components';
import { mocked } from 'jest-mock';
import { useGetFlashErrors } from 'src/hooks';

jest.mock('src/hooks/useGetFlashErrors');
const useGetFlashErrorsMock = mocked(useGetFlashErrors, true);

// scrollIntoView is not implemented in jsdom which jest uses. So we just stub it.
// https://github.com/jsdom/jsdom/issues/1695
const scrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

describe('Testing FlashError component', () => {

    const dataArray = [
        {
            name: 'Render with only one error',
            mockedReturnValue: ['error'],
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
            mockedReturnValue: ['error', 'error-2'],
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

});
