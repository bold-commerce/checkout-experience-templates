export function navigateDialog(event: null | BeforeUnloadEvent & {target: {activeElement: Location}}): string | void {
    const hash = event?.target?.activeElement?.hash ?? 'none';
    if(event && hash !== '#login' && hash !== '#footerBack' && hash !== '#breadcrumb') {
        //Dialog for leaving site, custom messages no longer supported, Mobile does not work.
        event.preventDefault();
        event.returnValue = '';
        return '';
    }
}
