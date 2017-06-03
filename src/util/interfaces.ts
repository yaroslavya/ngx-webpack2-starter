export interface ITypeOf<T> extends Function {
    new (...args: any[]): T;
}

export interface IClass extends Function {
    new (...args: any[]): any;
}

export type Partial<T> = {[P in keyof T]?: T[P]; };
