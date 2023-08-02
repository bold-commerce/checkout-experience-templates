
export class FlowError extends Error {
    constructor(message: string) {
        super(message);
        this.name = FlowError.name;
        Object.setPrototypeOf(this, FlowError.prototype);
    }
}

export class MetaNullStateKeyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = MetaNullStateKeyError.name;
        Object.setPrototypeOf(this, MetaNullStateKeyError.prototype);
    }
}