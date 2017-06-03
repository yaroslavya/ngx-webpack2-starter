declare module CryptoJS {
    export interface ICryptoResult {
        toString(): string;
    }

    export function MD5(str: string): ICryptoResult;
}