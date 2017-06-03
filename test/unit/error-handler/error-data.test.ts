import { ErrorData, DebugContextData } from "../../../src";
import ICtorArgs = ErrorData.ICtorArgs;

//We need this helper to get rid of typescript errors.
let getErrorData = (): ErrorData => {
	let errConstructorArgsStub = {} as any as ErrorData.ICtorArgs;

	return new ErrorData(errConstructorArgsStub);
};

describe("ErrorData ", () => {
	it("When created with no arguments should use default values", () => {
		//arrange/act
		const data = getErrorData();

		//assert
		expect(data.when).toBeDefined("ErrorData.when should be set to current date");

		expect(data.fileName).toEqual("unknown","ErrorData.fileName should be set to 'unknown' by default");
		expect(data.functionName).toEqual("", "ErrorData.functionName should be empty by default");

		expect(data.message).toEqual("", "ErrorData.message should be empty by default");

		expect(data.stackItems).toEqual([], "ErrorData.stackItems should be empty array by default");

		expect(data.originalError).toBeUndefined("ErrorData.originalError should be undefined by default");
		expect(data.ngContext).toBeUndefined("ErrorData.ngContext should be undefined by default");
	});

	it("When created from ICtorArgs properties are mapped correctly", () => {
		const sept = 8;
		const ng2ReleaseDate = new Date(2016, sept, 14);
		const ngContextStub ={dumbNgContextStuff:"simulation"} as any as DebugContextData;

		//arrange
		const ctorArgs = {
			when: ng2ReleaseDate,
			originalError: new Error("Databse error"),
			message: "error message",
			fileName: "throwy.ts",
			functionName: "iThrowErrors",
			stackItems: [1, 2, 3],
			ngContext : ngContextStub
		} as ICtorArgs;

		//act
		const data = new ErrorData(ctorArgs);

		//assert
		expect(data.when).toEqual(ctorArgs.when, "ErrorData.when should be set the date provided");
		expect(data.fileName).toEqual(ctorArgs.fileName, "ErrorData.fileName should be mapped properly");
		expect(data.functionName).toEqual(ctorArgs.functionName, "ErrorData.functionName should be mapped properly");

		expect(data.message).toEqual(ctorArgs.message, "ErrorData.message should be mapped properly");

		expect(data.stackItems).toEqual(ctorArgs.stackItems, "ErrorData.stackItems should be mapped properly");

		expect(data.originalError).toEqual(ctorArgs.originalError, "ErrorData.originalError should be mapped properly");
		expect(data.ngContext).toEqual(ctorArgs.ngContext, "ErrorData.ngContext should be mapped properly");
	});
});