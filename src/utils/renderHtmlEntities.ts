export function renderHtmlEntities(htmlEntity: string ) :string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = htmlEntity;

    return textarea.value;
}