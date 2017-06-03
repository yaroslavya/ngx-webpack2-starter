import * as deepEquals from "deep-equal";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { IClass } from "./interfaces";
import { isEntity } from "entity-space";

export function equals(a: any, b: any): boolean {
    return deepEquals(a, b);
}

export function undefinedToNull<T>(obj: T): T {
    for (let k in obj) {
        if (obj[k] == undefined) {
            obj[k] = null;
        }
    }

    return obj;
}

export function containsDefined(obj: Object): boolean {
    for (let k in obj) {
        if (obj[k] != undefined) return true;
    }

    return false;
}

export function toKeywords(str: string): string[] {
    if (!str) return [];

    return str.split(" ")
        .filter(str => str.length > 0)
        .map(str => str.toLocaleLowerCase())
        .filter((str, i, a) => a.indexOf(str) === i);
}

export function matchesKeywords(subject: string, keywords: string | string[]): boolean {
    if (typeof (keywords) == "string") {
        keywords = toKeywords(keywords);
    }

    subject = subject.toLocaleLowerCase();

    return keywords.every(kw => subject.indexOf(kw) !== -1);
}

export function noneAnyOrAll<T>(promises: Promise<T>[], includeErrors?: boolean): Promise<T[]> {
    return new Promise((resolve) => {
        if (promises.length == 0) resolve([]);

        let open = promises.length;
        let results = new Array<any>();

        let helper = (index, result) => {
            open--;
            results[index] = result;
            if (open <= 0) resolve(results);
        };

        promises.forEach((p, i) => {
            p.then(r => helper(i, r), e => helper(i, includeErrors ? e : undefined))
        });
    });
}

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number; }> {
    return new Promise((resolve, reject) => {
        let img = new Image;
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = (ev) => reject(`failed to read dimensions`);
        img.src = dataUrl;
    });
}

export function getAspectRatio(width: number, height: number): string {
    var r = greatestCommonDivisor(width, height);

    return (width / r) + ":" + (height / r);
}

export function greatestCommonDivisor(a: number, b: number): number {
    if (b == 0) return a;

    return greatestCommonDivisor(b, a % b);
}

export function getEnumValues(_enum: Object): number[] {
    return Object.keys(_enum).map(k => _enum[k]).filter(v => typeof v == "number") as number[];
}

export function randomColor(): string {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export function guid(): string {
    let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

export function colorFromNumber(num: number): string {
    var c = (num & 0x00FFFFFF).toString(16).toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

export function hashCode(str: string): number {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return hash;
}

export function dataURItoBlob(dataURI): Blob {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;

    if (dataURI.split(",")[0].indexOf("base64") >= 0) {
        byteString = atob(dataURI.split(",")[1]);
    } else {
        byteString = decodeURI(dataURI.split(",")[1]);
    }


    // separate out the mime component
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

export function isInjectable(type: Function): boolean {
    return Reflect.getMetadataKeys(type).includes("design:paramtypes")
        && !isEntity(type as any);
}

export function isDirective(type: Function): boolean {
    let metadata = Reflect.getMetadata("annotations", type);

    return metadata instanceof Array
        && (
            typeof (metadata[0]["selector"]) == "string" // component
            || typeof (metadata[0]["pure"]) == "boolean" // pipe
        );
}

export function isModule(type: Function): boolean {
    let metadata = Reflect.getMetadata("annotations", type);

    return metadata instanceof Array
        && "providers" in metadata[0]
        && "declarations" in metadata[0];
}

export function splitIntoModuleFriendly(types: Function[]): {
    directives: IClass[];
    providers: IClass[];
    modules: IClass[];
} {
    let directives: IClass[] = [];
    let providers: IClass[] = [];
    let modules: IClass[] = [];

    types.forEach(t => {
        if (isDirective(t)) {
            directives.push(t as IClass);
        } else if (isModule(t)) {
            modules.push(t as IClass);
        } else if (isInjectable(t)) {
            providers.push(t as IClass);
        }
    });

    return {
        directives: directives,
        providers: providers,
        modules: modules
    };
}

export function toParentRouteString(route: ActivatedRoute | ActivatedRouteSnapshot): string {
    if (route instanceof ActivatedRoute) {
        return route.pathFromRoot.slice(0, -1).map(r => r.snapshot.url)._flatten().map(s => s.path).join("/");
    } else {
        return route.pathFromRoot.slice(0, -1).map(r => r.url)._flatten().map(s => s.path).join("/");
    }
}

export function resizeImage(args: {
    dataUrl: string;
    maxWidth?: number;
    maxHeight?: number;
    stepScale?: number;
}): Promise<string> {
    return new Promise((resolve, reject) => {
        let img = new Image();

        img.onload = () => {
            let stepScale = args.stepScale || 0.5;
            let targetWidth: number;
            let targetHeight: number;
            let imageAspectRatio = img.width / img.height;

            if (args.maxWidth && args.maxHeight) {
                let boundaryAspectRatio = args.maxWidth / args.maxHeight;
                if (boundaryAspectRatio >= imageAspectRatio) {
                    targetWidth = args.maxHeight * imageAspectRatio;
                    targetHeight = args.maxHeight;
                } else {
                    targetWidth = args.maxWidth;
                    targetHeight = args.maxWidth / imageAspectRatio;
                }
            } else if (args.maxWidth) {
                targetWidth = args.maxWidth;
                targetHeight = args.maxWidth / imageAspectRatio;
            } else if (args.maxHeight) {
                targetWidth = args.maxHeight * imageAspectRatio;
                targetHeight = args.maxHeight;
            }

            let canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext("2d").drawImage(img, 0, 0);

            let fromCanvas = canvas;
            let result: string;

            while (true) {
                let width = Math.max(targetWidth, fromCanvas.width * stepScale);
                let height = Math.max(targetHeight, fromCanvas.height * stepScale);
                let toCanvas = document.createElement("canvas");

                toCanvas.width = width;
                toCanvas.height = height;
                toCanvas.getContext("2d").drawImage(fromCanvas, 0, 0, width, height);

                if (width == targetWidth && height == targetHeight) {
                    result = toCanvas.toDataURL();
                    break;
                }

                fromCanvas = toCanvas;
            }

            resolve(result);
        };

        img.onerror = () => reject("failed to load image");
        img.src = args.dataUrl;
    });
}

export function guessMimeFromBase64(data: string): string {
    let binary = atob(data);
    let start = "";
    let end = binary.slice(-2).charCodeAt(0).toString(16) + binary.slice(-1).charCodeAt(0).toString(16);

    for (let i = 0; i < 8; ++i) {
        let char = binary.charCodeAt(i).toString(16).toUpperCase();
        start += char.length === 1 ? "0" + char : char;
    }

    if (start.startsWith("89504E470D0A1A0A")) return "image/png";
    if (start.startsWith("FFD8") && end.toUpperCase() == "FFD9") return "image/jpeg";
    if (start.startsWith("474946383761") || start.startsWith("474946383961")) return "image/gif";

    return null;
}
