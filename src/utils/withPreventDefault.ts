interface DefaultPreventableEvent { preventDefault: () => void }

export const withPreventDefault = (
    fn: () => void,
): ((event: DefaultPreventableEvent) => void) => {
    return (event: DefaultPreventableEvent) => {
        event.preventDefault();
        fn();
    };
};
