import { ErrorDataService, ErrorData } from "../../../src";

//We need this helper to get rid of typescript errors.
let getErrorData = (): ErrorData => {
	let errConstructorArgsStub = {} as any as ErrorData.ICtorArgs;

	return new ErrorData(errConstructorArgsStub);
};

describe("ErrorDataService", () => {
	it("When error is added getAll return one more error", () => {
		//arrange
		let errorDataService = new ErrorDataService();

		//act
		let errorsBeforeAdd = errorDataService.getAll().length;
		errorDataService.add(getErrorData());
		let errorsAfterAdd = errorDataService.getAll().length;

		//assert
		expect(errorsBeforeAdd).toEqual(errorsAfterAdd-1, "Number of errors doesnt match");
	});

	it("When several errors are added getAll return more errors", () => {
		//arrange
		let errorDataService = new ErrorDataService();

		//act
		errorDataService.add(getErrorData());
		let errorsBeforeAdd = errorDataService.getAll().length;

		errorDataService.add(getErrorData());
		errorDataService.add(getErrorData());
		errorDataService.add(getErrorData());

		let errorsAfterAdd = errorDataService.getAll().length;

		//assert
		expect(errorsBeforeAdd).toEqual(1, "We added 1 error initially");
		expect(errorsAfterAdd).toEqual(errorsBeforeAdd + 3, "Number of errors after adding 3 doesnt match");
	});
});