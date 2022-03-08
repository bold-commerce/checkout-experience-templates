import {IApplicationStateLineItem} from 'src/types';

export function getTotalLineItems(line_items: Array<IApplicationStateLineItem>): number  {
    let totalLineItems = 0;
    // Products totals
    line_items.map((item: IApplicationStateLineItem) => {
        totalLineItems += item.product_data.quantity * item.product_data.price;
    });
    return totalLineItems;
}
