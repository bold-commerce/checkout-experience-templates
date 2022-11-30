class ResizeObserver {
    func: () => void;
    constructor(func){
        this.func = func;
    }
    observe() {
        //execute function on observe call to mimic ResizeObserver
        this.func();
    }
    unobserve() {
        // do nothing
    }
    disconnect() {}
}
  
export default ResizeObserver;
