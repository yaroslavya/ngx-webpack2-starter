declare module Globalize {
    export function format(value: any, format?: string, culture?: string): string;
    export function parseFloat(value: string, base?: number, culture?: string): number;
} 