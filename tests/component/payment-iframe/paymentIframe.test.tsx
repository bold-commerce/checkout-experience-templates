import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {PaymentIframe} from 'src/components';
import {useGetPigiUrl, useSetPigiListener, useGetLoaderScreenVariable, useGetPigiDisplaySca} from 'src/hooks';

jest.mock('src/hooks');
const useGetPigiUrlMock = mocked(useGetPigiUrl, true);
const useSetPigiListenerMock = mocked(useSetPigiListener, true);
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetPigiDisplayScaMock = mocked(useGetPigiDisplaySca, true);

describe('Testing PaymentIframe component', () => {
    const onLoad = jest.fn();
    beforeEach(() => {
        jest.resetAllMocks();
        useGetPigiUrlMock.mockReturnValue('');
        useGetLoaderScreenVariableMock.mockReturnValue(false);
        useGetPigiDisplayScaMock.mockReturnValue(false);
    });

    test('PaymentIframe Renders loaded', () => {
        const {container} = render(<PaymentIframe onLoad={onLoad}/>);

        expect(useGetPigiUrlMock).toHaveBeenCalledTimes(1);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(1);
        expect(useSetPigiListenerMock).toHaveBeenCalledTimes(1);
        expect(useGetPigiDisplayScaMock).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('payment__iframe').length).toBe(1);
        expect(container.getElementsByClassName('payment__iframe--hidden').length).toBe(0);
        expect(container.getElementsByClassName('payment__iframe--display-sca').length).toBe(0);
    });

    test('PaymentIframe Renders loading', () => {
        useGetLoaderScreenVariableMock.mockReturnValueOnce(true);
        const {container} = render(<PaymentIframe onLoad={onLoad}/>);

        expect(useGetPigiUrlMock).toHaveBeenCalledTimes(1);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(1);
        expect(useSetPigiListenerMock).toHaveBeenCalledTimes(1);
        expect(useGetPigiDisplayScaMock).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('payment__iframe').length).toBe(1);
        expect(container.getElementsByClassName('payment__iframe--hidden').length).toBe(1);
        expect(container.getElementsByClassName('payment__iframe--display-sca').length).toBe(0);
    });

    test('PaymentIframe Renders handling SCA', () => {
        useGetPigiDisplayScaMock.mockReturnValueOnce(true);
        const {container} = render(<PaymentIframe onLoad={onLoad}/>);

        expect(useGetPigiUrlMock).toHaveBeenCalledTimes(1);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(1);
        expect(useSetPigiListenerMock).toHaveBeenCalledTimes(1);
        expect(useGetPigiDisplayScaMock).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('payment__iframe').length).toBe(1);
        expect(container.getElementsByClassName('payment__iframe--hidden').length).toBe(0);
        expect(container.getElementsByClassName('payment__iframe--display-sca').length).toBe(1);
    });
});
