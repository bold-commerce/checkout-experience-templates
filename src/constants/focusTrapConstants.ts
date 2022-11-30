const checkFocusDelay = (): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 700));
};

export const focusTrapOptions = {
    checkCanFocusTrap: checkFocusDelay,
    checkCanReturnFocus: checkFocusDelay,
    escapeDeactivates: false,
    clickOutsideDeactivates: true
};