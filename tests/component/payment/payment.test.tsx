import {render} from '@testing-library/react';
import {Payment} from 'src/components';
import {EpsPayment} from 'src/components';
import {mocked} from 'jest-mock';
import {useGetLoaderScreenVariable, useGetPaymentSection, useGetIsSessionInitialized} from 'src/hooks';
import {IUseGetPaymentSection} from 'src/types';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

jest.mock('src/hooks');
jest.mock('src/components/eps-payment/EpsPayment');
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetPaymentSectionMock = mocked(useGetPaymentSection, true);
const useGetIsSessionInitializedMock = mocked(useGetIsSessionInitialized, true);
const EpsPaymentMock = mocked(EpsPayment, true);
const mockStore = createStore((state = {}) => state);

describe('Testing Payment component', () => {
    const IUseGetPaymentSectionMock = {
        loading: false,
        isValidAddress: true,
        isValidShippingLine: true,
        isValidPigiLoad: true,
        notValidText: 'Not valid address',
        fieldSectionText: 'Payment method'
    } as IUseGetPaymentSection;

    beforeEach(() => {
        jest.resetAllMocks();
        EpsPaymentMock.mockReturnValue(<div data-testid="eps-payment"/>);
        useGetLoaderScreenVariableMock.mockReturnValue(false);
    });

    const renderWithProvider = (component: React.ReactElement) => {
        return render(
            <Provider store={mockStore}>
                {component}
            </Provider>
        );
    };

    test('Payment Renders with loaded payment block', () => {
        const hookReturnMock = {...IUseGetPaymentSectionMock, loading: false};
        useGetPaymentSectionMock.mockReturnValueOnce(hookReturnMock);

        const {container} = renderWithProvider(<Payment/>);

        expect(useGetPaymentSectionMock).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('payment__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('field-section__header').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading')[0].textContent).toBe(IUseGetPaymentSectionMock.fieldSectionText);
        expect(container.getElementsByClassName('field-section__content').length).toBe(1);
        expect(container.getElementsByClassName('payment__block').length).toBe(1);
        expect(container.getElementsByClassName('payment__no-valid-address').length).toBe(0);
    });

    test('Payment Renders with LockedSection invalid Address', () => {
        const hookReturnMock = {...IUseGetPaymentSectionMock, loading: false, isValidAddress: false};
        useGetPaymentSectionMock.mockReturnValueOnce(hookReturnMock);

        const {container} = renderWithProvider(<Payment/>);

        expect(useGetPaymentSectionMock).toHaveBeenCalledTimes(1);
        expect(useGetLoaderScreenVariableMock).not.toHaveBeenCalled();
        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('payment__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('field-section__header').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading')[0].textContent).toBe(IUseGetPaymentSectionMock.fieldSectionText);
        expect(container.getElementsByClassName('field-section__content').length).toBe(1);
        expect(container.getElementsByClassName('payment__block').length).toBe(0);
        expect(container.getElementsByClassName('payment__no-valid-address-label').length).toBe(1);
        expect(container.getElementsByClassName('payment__no-valid-address-label')[0].textContent).toBe(IUseGetPaymentSectionMock.notValidText);
        expect(container.getElementsByClassName('payment__no-valid-address').length).toBe(1);
    });

    test('Payment Renders with LockedSection invalid ShippingLine', () => {
        const hookReturnMock = {...IUseGetPaymentSectionMock, loading: false, isValidShippingLine: false};
        useGetPaymentSectionMock.mockReturnValueOnce(hookReturnMock);

        const {container} = renderWithProvider(<Payment/>);

        expect(useGetPaymentSectionMock).toHaveBeenCalledTimes(1);
        expect(useGetLoaderScreenVariableMock).not.toHaveBeenCalled();
        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('payment__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('field-section__header').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading')[0].textContent).toBe(IUseGetPaymentSectionMock.fieldSectionText);
        expect(container.getElementsByClassName('field-section__content').length).toBe(1);
        expect(container.getElementsByClassName('payment__block').length).toBe(0);
        expect(container.getElementsByClassName('payment__no-valid-address-label').length).toBe(1);
        expect(container.getElementsByClassName('payment__no-valid-address-label')[0].textContent).toBe(IUseGetPaymentSectionMock.notValidText);
        expect(container.getElementsByClassName('payment__no-valid-address').length).toBe(1);
    });

    test('Payment Renders with loadIframeImmediately true and initialized true', () => {
        const hookReturnMock = {...IUseGetPaymentSectionMock, loading: false};
        useGetPaymentSectionMock.mockReturnValueOnce(hookReturnMock);
        useGetIsSessionInitializedMock.mockReturnValue(true);

        const {container} = renderWithProvider(<Payment loadIframeImmediately={true}/>);

        expect(useGetPaymentSectionMock).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('payment__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('field-section__header').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading')[0].textContent).toBe(IUseGetPaymentSectionMock.fieldSectionText);
        expect(container.getElementsByClassName('field-section__content').length).toBe(1);
        expect(container.getElementsByClassName('payment__block').length).toBe(1);
        expect(container.getElementsByClassName('payment__no-valid-address').length).toBe(0);
    });

    test('Payment Renders with loadIframeImmediately true and initialized false', () => {
        const hookReturnMock = {...IUseGetPaymentSectionMock, loading: false};
        useGetPaymentSectionMock.mockReturnValueOnce(hookReturnMock);
        useGetIsSessionInitializedMock.mockReturnValue(false);

        const {container} = renderWithProvider(<Payment loadIframeImmediately={true}/>);

        expect(useGetPaymentSectionMock).toHaveBeenCalledTimes(1);
        expect(useGetLoaderScreenVariableMock).not.toHaveBeenCalled();
        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('payment__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('field-section__header').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading').length).toBe(1);
        expect(container.getElementsByClassName('field-section__heading')[0].textContent).toBe(IUseGetPaymentSectionMock.fieldSectionText);
        expect(container.getElementsByClassName('field-section__content').length).toBe(1);
        expect(container.getElementsByClassName('payment__block').length).toBe(0);
        expect(container.getElementsByClassName('payment__no-valid-address-label').length).toBe(1);
        expect(container.getElementsByClassName('payment__no-valid-address-label')[0].textContent).toBe(IUseGetPaymentSectionMock.notValidText);
        expect(container.getElementsByClassName('payment__no-valid-address').length).toBe(1);
    });
});
