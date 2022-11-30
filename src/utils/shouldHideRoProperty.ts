export function shouldHideRoProperty(key: string, cartParameters: Record<string, string>): boolean{
    const roProperties = ['frequency_num', 'frequency_type', 'frequency_type_text', 'group_id', 'discounted_price'];
    //hide recurring order line item property if cart parameters indicate recurring order and key in above list
    return cartParameters['recurring_order']?.toString() === 'true' && roProperties.includes(key);
}