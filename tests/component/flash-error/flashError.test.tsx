import {render} from '@testing-library/react';
import {FlashError} from 'src/components';
import {mocked} from 'ts-jest/utils';
import {useGetFlashErrors} from 'src/hooks';
import {counterNames} from 'src/constants';

jest.mock('src/hooks/useGetFlashErrors');
const useGetFlashErrorsMock = mocked(useGetFlashErrors, true);

describe('Testing FlashError component', () => {
    const {zero, one, two} = counterNames;

    const dataArray = [
        {
            name: 'Render with only one error',
            mockedReturnValue: ['error'],
            flashErrorCount: one,
            flashErrorContainerCount: one,
            flashErrorTextCount: one
        },
        {
            name: 'Render with no error',
            mockedReturnValue: [],
            flashErrorCount: one,
            flashErrorContainerCount: zero,
            flashErrorTextCount: zero
        },
        {
            name: 'Render with multiple error',
            mockedReturnValue: ['error', 'error-2'],
            flashErrorCount: one,
            flashErrorContainerCount: two,
            flashErrorTextCount: two
        }
    ];

    beforeEach(() => {
        jest.restoreAllMocks();
    });


    test.each(dataArray)( '$name', async ({mockedReturnValue, flashErrorCount, flashErrorContainerCount, flashErrorTextCount}) => {
        useGetFlashErrorsMock.mockReturnValueOnce(mockedReturnValue);
        const {container} = render(<FlashError/>);
        expect(container.getElementsByClassName('flash-error').length).toBe(flashErrorCount);
        expect(container.getElementsByClassName('flash-error__container').length).toBe(flashErrorContainerCount);
        expect(container.getElementsByClassName('flash-error__text').length).toBe(flashErrorTextCount);
    });

});
