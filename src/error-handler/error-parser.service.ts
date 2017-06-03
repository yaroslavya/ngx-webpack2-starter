import { Injectable } from "@angular/core";

import { ErrorData } from "./error-data";
import { StackStep } from "./stack-step";
import { DebugContextData } from "./debug-context-data";

@Injectable()
export class ErrorParser {

    readonly FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
    readonly CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;

    readonly MAX_STACK_STEPS = 15;

    /**
    * Method parses the error data completely. if error has angular context object it is also parsed as well.
    *
    * @param err: any - so that we can safely access browser specific properties here.
    */
    public parse(err: any): ErrorData {
        let stackItems = this.parseStack(err);

        stackItems = stackItems.filter(x => {
            return x.functionName !== "new ZoneAwarePromise" && x.functionName !== "eval";
        });

        let ngContext = new DebugContextData(err.context);//this.getContextData(err.context);

        let errorDataCtorArgs = {
            originalError: err,
            message: err.message,
            stackItems: stackItems,
            ngContext: ngContext
        } as any as ErrorData.ICtorArgs;

        let errorData = new ErrorData(errorDataCtorArgs);

        if (stackItems && stackItems.length > 0) {
            let item = stackItems[0];
            errorData.fileName = item.fileName;
            errorData.functionName = item.functionName;
        }

        errorData["faulty"] = this.markFaulty(stackItems, ngContext);

        return errorData;
    }

    /**
     * Marks debug context faulty function as faulty and returns its name.
     *
     * @param stackSteps: Array<StackStep> parsed stack trace
     * @param ngContext: any
     */
    private markFaulty(stackSteps: Array<StackStep>, ngContext: any): any {
        let methods = ngContext.methods;
        let matches = {};

        for (let methodName in methods) {
            for (let i = 0; i < stackSteps.length; i++) {
                if (stackSteps[i].functionName.indexOf(methodName) !== -1) {
                    methods[methodName].isFaulty = true;
                    //TODO: get rid of Faulty-> hardcode.
                    methods[`Faulty->${methodName}`] = methods[methodName];
                    matches[`Faulty->${methodName}`] = methods[methodName];
                    matches["gotoSource"] = methods[methodName]["[[FunctionLocation]]"];
                }
            }
        }

        //if angular doesn't catch the DebugContext we assume that the very first function is the faulty one.
        if (matches == "" && stackSteps.length > 0) {
            matches = stackSteps[0].functionName;
        }

        return matches;
    }

    /**
    *  Parses the stack from the error.
    *  Any is only used as the type for the error here as we need to make assumptions on whats inside,
    *  depending on the browser we are dealing with.
    *
    *  @param err:any the error which stack is parsed.
    */
    private parseStack(err: any): any {
        //TODO: change to parser selector, so we perform this check only once and then use the selected parser.
        if (typeof err.stacktrace !== 'undefined' || typeof err['opera#sourceloc'] !== 'undefined') {
            return this.parseOpera(err);
        } else if (err.stack && err.stack.match(this.CHROME_IE_STACK_REGEXP)) {
            return this.parseChromeOrIE(err);
        } else if (err.stack) {
            return this.parseFFOrSafari(err);
        } else {
            throw new Error('Cannot parse the given Error object');
        }
    }

    /**
     * Parses the call stack data for the chrome and internet explorer browsers.
     *
     * @param: Error original error object to be parsed.
     */
    private parseChromeOrIE(err: Error): Array<StackStep> {
        let stackArr = err.stack.split("\n").filter(item => {
            return !!item.match(this.CHROME_IE_STACK_REGEXP);
        }).slice(0, this.MAX_STACK_STEPS);

        let stackSteps: Array<StackStep> = [];

        stackArr.forEach((item, index) => {
            if (item.indexOf("(eval ") > -1) {
                // Throw away eval information until we are able to parse it.
                item = item.replace(/eval code/g, "eval").replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
            }

            var tokens = item.replace(/^\s+/, "").replace(/\(eval code/g, "(").split(/\s+/).slice(1);
            var locationParts = this.extractLocation(tokens.pop());
            var functionName = tokens.join(" ") || undefined;
            var fileName = ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

            stackSteps.push(new StackStep({
                functionName: functionName,
                fileName: fileName,
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
                source: item
            }));
        });

        return stackSteps;
    }

    /**
     * Parses the call stack data for the Opera 11. Earlier operas are not supported.
     * Latest opera is parsed as chrome as it use V8 as js engine.
     *
     * @param: Error original error object to be parsed.
     */
    private parseOpera(err: Error): Array<StackStep> {
        let stackArr = err.stack.split("\n").filter(item => {
            return !!item.match(this.FIREFOX_SAFARI_STACK_REGEXP) && !item.match(/^Error created at/);
        }).slice(0, this.MAX_STACK_STEPS);

        let stackSteps: Array<StackStep> = [];

        stackArr.forEach((item) => {
            var tokens = item.split("@");
            var locationParts = this.extractLocation(tokens.pop());
            var functionCall = (tokens.shift() || "");
            var functionName = functionCall
                .replace(/<anonymous function(: (\w+))?>/, "$2")
                .replace(/\([^\)]*\)/g, '') || undefined;
            var argsRaw;
            if (functionCall.match(/\(([^\)]*)\)/)) {
                argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, "$1");
            }
            var args = (argsRaw === undefined || argsRaw === "[arguments not available]") ?
                undefined : argsRaw.split(",");

            stackSteps.push(new StackStep({
                functionName: functionName,
                args: args,
                fileName: locationParts[0],
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
                source: item
            }));
        });

        return stackSteps;
    }

    /**
     * Parses the call stack data for the chrome and internet explorer browsers.
     *
     * @param: Error original error object to be parsed.
     */
    private parseFFOrSafari(err: Error): Array<StackStep> {
        let stackArr = err.stack.split("\n").filter(item => {
            return !!item.match(this.FIREFOX_SAFARI_STACK_REGEXP);
        }).slice(0, this.MAX_STACK_STEPS);

        let stackSteps: Array<StackStep> = [];

        stackArr.forEach((item) => {
            if (item.indexOf(" > eval") > -1) {
                item = item.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
            }

            if (item.indexOf('@') === -1 && item.indexOf(':') === -1) {
                // Safari eval frames only have function names and nothing else
                stackSteps.push(new StackStep({ source: item }));
            } else {
                var tokens = item.split("@");
                var locationParts = this.extractLocation(tokens.pop());
                var functionName = tokens.join("@") || undefined;

                let stackStep = new StackStep({
                    functionName: functionName,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: item
                });

                stackSteps.push(stackStep);
            }
        });

        return stackSteps;
    }

    /**
     * extracting the location part from the stack trace line.
     *
     * @param url the string pointing to the place in code where the error have occurred .
     */
    private extractLocation(url): Array<any> {
        // Fail-fast but return locations like "(native)"
        if (url.indexOf(':') === -1) {
            return [url];
        }

        var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
        var parts = regExp.exec(url.replace(/[\(\)]/g, ''));
        return [parts[1], parts[2] || undefined, parts[3] || undefined];
    }
}
