import {useGetAvailableShippingLines, useGetSelectShippingLine} from 'src/hooks';
import {IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {isObjectEmpty} from 'src/utils';

export function isShippingLineSelectedValid(): boolean {
    const selectedShippingLine = useGetSelectShippingLine() as IShippingLine;
    const shippingLinesAvailable = useGetAvailableShippingLines();
    if (shippingLinesAvailable.length <= 0) {
        return false;
    }

    const selectedShippingLineIsValid = shippingLinesAvailable.find((shippingLine: IShippingLine) => {
        return shippingLine.id === selectedShippingLine.id &&
            shippingLine.description === selectedShippingLine.description &&
            shippingLine.amount === selectedShippingLine.amount;
    });
    return !isObjectEmpty(selectedShippingLineIsValid);
}
