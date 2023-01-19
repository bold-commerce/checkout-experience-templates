import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetIsLoadingExceptSections} from 'src/hooks';
import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';

jest.mock('src/hooks/rootHooks');
const useAppSelectorMock = mocked(useAppSelector, true);

describe('Testing hook useGetIsLoadingExceptSections', () => {

    const isLoadingCustomerMock = {...stateMock.isLoading};
    isLoadingCustomerMock.customerPageButton = true;

    const isLoadingPigiMock = {...stateMock.isLoading};
    isLoadingCustomerMock.pigiIframe = true;

    const dataset = [
        {name: 'With all value false', data: stateMock.isLoading, expected: false },
        {name: 'With one value true', data: isLoadingCustomerMock , expected: true },
        {name: 'With all value false', data: isLoadingPigiMock, expected: false },
    ];


    beforeEach(() => {
        jest.clearAllMocks();
    });


    test.each(dataset)( '$name', async ({data, expected}) => {
        useAppSelectorMock.mockReturnValueOnce(data);
        const {result} = renderHook(() => useGetIsLoadingExceptSections());
        expect(result.current).toBe(expected);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
