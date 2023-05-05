import {ILineItem} from '@boldcommerce/checkout-frontend-library';

export function getTotalLineItems(line_items: Array<ILineItem>): number  {
    let totalLineItems = 0;
    // Products totals
    line_items.map((item: ILineItem) => {
        totalLineItems += item.product_data.quantity * item.product_data.price;
    });
    return totalLineItems;
}
