import {useCallback, useLayoutEffect, useState} from 'react';
import {IUseGetCartItem} from 'src/types';
import {useDebouncedCallback} from 'use-debounce';
import {ILineItem} from '@boldcommerce/checkout-frontend-library';

interface onUpdateQuantityFn {
    (lineItemKey: string, quantity: number): Promise<void>;
}

export function useCartItem(
    lineItem: ILineItem,
    quantityDisabled?: boolean,
    onUpdateQuantity?: onUpdateQuantityFn,
): IUseGetCartItem {
    const productData = lineItem.product_data;
    const [localQuantity, setLocalQuantity] = useState(productData.quantity);

    /**
     * Handles the `onCommit` event of the `SemiControlledNumberInput` component and calls
     * `props.onUpdateQuantity` with the new quantity.
     *
     * Also called when the debounce timer is up.
     */
    const commit = useCallback((newQuantity: number) => {
        debounceUpdateQuantity.cancel();
        if (productData.quantity === newQuantity) {
            return; 
        }
        (onUpdateQuantity as onUpdateQuantityFn)(productData.line_item_key, newQuantity);
    }, [productData.line_item_key, onUpdateQuantity, productData.quantity]);

    /**
     * Calls `props.onQuantityChange` with the quantity provided after 1 second.
     */
    const debounceUpdateQuantity = useDebouncedCallback(commit, 1000);

    /**
     * increments the quantity of the local state
     */
    const incrementQuantity = useCallback(async (event) => {
        setLocalQuantity(ps => {
            if(quantityDisabled) {
                event.preventDefault();
                return ps;
            } 
            const newQty = ps + 1;
            debounceUpdateQuantity(newQty);
            return newQty;
        });
    }, [debounceUpdateQuantity]);

    /**
     * Decrements the quantity of the local state. Quantity is not allowed to be less than 1.
     */
    const decrementQuantity = useCallback(async (event) => {
        setLocalQuantity(ps => {
            if(quantityDisabled) {
                event.preventDefault();
                return ps;
            } 
            const newQty = Math.max(1, ps - 1);
            debounceUpdateQuantity(newQty);
            return newQty;
        });
    }, [debounceUpdateQuantity]);

    // One way binding the local quantity to the prop quantity
    // If there is a pending update to submit the quantity to `props.onUpdateQuantity`, it will be cancelled
    useLayoutEffect(() => {
        debounceUpdateQuantity.cancel();
        setLocalQuantity(productData.quantity);
    }, [productData.quantity]);

    return {
        updateQuantity: commit,
        incrementQuantity,
        decrementQuantity,
        quantity: localQuantity,
    };
}
