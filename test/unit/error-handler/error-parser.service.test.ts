import { ErrorParser } from "../../../src";
import { CapturedErrors } from "./captured-errors";

class TestService {
    first() {
        this.second();
    }

    private second() {
        this.third();
    }

    private third() {
        throw new Error("test error thrown");
    }
}

describe("ErrorParser", () => {
    xit("When error stack is parsed it shows the functions in the right order", () => {

        //arrange
        try {
            let testService = new TestService();
            testService.first();
        } catch (e) {

            //act
            let parser = new ErrorParser();
            let data = parser.parse(e);

            //assert
            expect(data.stackItems.length).toEqual(12);

            expect(data.stackItems[0].functionName).toEqual("TestService.third");
            expect(data.stackItems[1].functionName).toEqual("TestService.second");
            expect(data.stackItems[2].functionName).toEqual("TestService.first");

            //the further stackItems are including the zonejs stuff. So we dont care about them
            expect(data.stackItems[3].functionName).toEqual("Object.eval");
        }
    });

    it("When error stack from chrome is given its parsed correctly", () => {
        //arrange/act
        let parser = new ErrorParser();
        let data = parser.parse(CapturedErrors.CHROME);

        //assert
        expect(data.stackItems.length).toEqual(7);

        expect(data.stackItems[0].functionName).toEqual("Error", "StackItem[0] was not parsed correctly");
        expect(data.stackItems[1].functionName).toEqual("callMyFunction", "StackItem[1] was not parsed correctly");
        expect(data.stackItems[2].functionName).toEqual("Object.d [as add]", "StackItem[2] was not parsed correctly");

        expect(data.message).toEqual("Error: test", "Error message was not parsed correctly");
    });

    it("When error stack from FireFox is given its parsed correctly", () => {
        //arrange/act
        let parser = new ErrorParser();
        let data = parser.parse(CapturedErrors.FIREFOX);

        //assert
        expect(data.stackItems.length).toEqual(4, "Should have parsed 4 items");

        expect(data.stackItems[0].functionName).toEqual("[2]</Bar.prototype._baz/</<", "StackItem[0] was not parsed correctly");
        expect(data.stackItems[1].functionName).toEqual("App.prototype.callMyFunction", "StackItem[1] was not parsed correctly");
        expect(data.stackItems[2].functionName).toEqual("firefoxBar", "StackItem[2] was not parsed correctly");

        expect(data.fileName).toEqual("http://lake/of/serenity.js", "Filename was not parsed correctly");
    });

    it("When error stack from IE11 is given its parsed correctly", () => {
        //arrange/act
        let parser = new ErrorParser();
        let data = parser.parse(CapturedErrors.IE11);

        //assert
        expect(data.stackItems.length).toEqual(3, "Should have parsed 3 items");

        expect(data.stackItems[0].functionName).toEqual("Anonymous function", "StackItem[0] was not parsed correctly");
        expect(data.stackItems[1].functionName).toEqual("iMakeErrors", "StackItem[1] was not parsed correctly");
        expect(data.stackItems[2].functionName).toEqual("ngRootOfAllEvil", "StackItem[2] was not parsed correctly");
    });
});