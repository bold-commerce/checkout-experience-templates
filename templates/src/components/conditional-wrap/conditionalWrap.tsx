import {IConditionalWrapProps} from 'src/types';

export function ConditionalWrap({
    condition,
    children,
    element: Element = 'div',
    ...restProps
}: IConditionalWrapProps): JSX.Element {
    return condition ? <Element {...restProps}>{children}</Element> : <>{children}</>;
}