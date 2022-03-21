export function scriptsAreLoaded(scriptIds: Array<string>): boolean {
    let scriptsLoaded = true;
    scriptIds.map((id: string) => {
        scriptsLoaded = scriptsLoaded && !!document.getElementById(id);
    });

    return scriptIds.length > 0 && scriptsLoaded;
}
