import {render} from '@testing-library/react';
import {Payment} from 'src/components';
import {mocked} from 'ts-jest/utils';
import {useGetPigiUrl, useSetPigiListener, useGetLoaderScreenVariable, useGetPigiDisplaySca, useGetPaymentSection} from 'src/hooks';

jest.mock('src/hooks');
const useGetPigiUrlMock = mocked(useGetPigiUrl, true);
const useSetPigiListenerMock = mocked(useSetPigiListener, true);
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetPigiDisplayScaMock = mocked(useGetPigiDisplaySca, true);
const useGetPaymentSectionMock = mocked(useGetPaymentSection, true);

describe('Testing Payment component', () => {
    const baseHookReturnMock = {loading: false, isValidAddress: true, notValidText: 'Not valid address', fieldSectionText: 'Payment method'};

    beforeEach(() => {
        jest.resetAllMocks();
        useGetPigiUrlMock.mockReturnValue('');
        useGetLoaderScreenVariableMock.mockReturnValue(false);
        useGetPigiDisplayScaMock.mockReturnValue(false);
    });

    test('Payment Renders with loaded payment block', () => {
        const hookReturnMock = {...baseHookReturnMock, loading: false};
        useGetPaymentSectionMock.mockReturnValueOnce(hookReturnMock);

        const {container} = render(<Payment/>);

        expect(useGetPaymentSectionMock).toHaveBeenCalledTimes(1);
        expect(useSetPigiListenerMock).toHaveBeenCalledTimes(1);
        expect(useGetPigiUrlMock).toHaveBeenCalledTimes(1);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('payment__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('field-section__header').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading')[0].textContent).toBe(baseHookReturnMock.fieldSectionText);
        expect(container.getElementsByClassName('field-section__content').length).toBe(1);
        expect(container.getElementsByClassName('payment__block').length).toBe(1);
        expect(container.getElementsByClassName('payment__no-valid-address').length).toBe(0);
    });

    test('Payment Renders with loading payment block', () => {
        const hookReturnMock = {...baseHookReturnMock, loading: true};
        useGetPaymentSectionMock.mockReturnValueOnce(hookReturnMock);

        const {container} = render(<Payment/>);

        expect(useGetPaymentSectionMock).toHaveBeenCalledTimes(1);
        expect(useSetPigiListenerMock).toHaveBeenCalledTimes(1);
        expect(useGetPigiUrlMock).toHaveBeenCalledTimes(1);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('payment__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('field-section__header').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading')[0].textContent).toBe(baseHookReturnMock.fieldSectionText);
        expect(container.getElementsByClassName('field-section__content').length).toBe(1);
        expect(container.getElementsByClassName('payment__block').length).toBe(1);
        expect(container.getElementsByClassName('payment__no-valid-address').length).toBe(1);
    });

    test('Payment Renders with LockedSection', () => {
        const hookReturnMock = {...baseHookReturnMock, loading: false, isValidAddress: false};
        useGetPaymentSectionMock.mockReturnValueOnce(hookReturnMock);

        const {container} = render(<Payment/>);

        expect(useGetPaymentSectionMock).toHaveBeenCalledTimes(1);
        expect(useSetPigiListenerMock).not.toHaveBeenCalled();
        expect(useGetPigiUrlMock).not.toHaveBeenCalled();
        expect(useGetLoaderScreenVariableMock).not.toHaveBeenCalled();
        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('payment__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('field-section__header').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading')[0].textContent).toBe(baseHookReturnMock.fieldSectionText);
        expect(container.getElementsByClassName('field-section__content').length).toBe(1);
        expect(container.getElementsByClassName('payment__block').length).toBe(0);
        expect(container.getElementsByClassName('payment__no-valid-address-label').length).toBe(1);
        expect(container.getElementsByClassName('payment__no-valid-address-label')[0].textContent).toBe(baseHookReturnMock.notValidText);
        expect(container.getElementsByClassName('payment__no-valid-address').length).toBe(1);
    });
});
