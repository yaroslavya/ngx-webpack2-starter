export class CapturedErrors {
    public static CHROME = {
        message: "Error: test",
        name: "Error",
        stack: "Error: test\n" +
        "    at Error (native)\n" +
        "    at callMyFunction (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:31:29146)\n" +
        "    at Object.d [as add] (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:31:30039)\n" +
        "    at blob:http%3A//localhost%3A8080/d4eefe0f-361a-4682-b217-76587d9f712a:15:10978\n" +
        "    at blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:1:6911\n" +
        "    at n.fire (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:7:3019)\n" +
        "    at n.handle (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:7:2863)"
    };

    public static FIREFOX = {
        message: "",
        name: "NS_ERROR_FAILURE",
        stack: "[2]</Bar.prototype._baz/</<@http://lake/of/serenity.js:703:28\n" +
        "App.prototype.callMyFunction@file:///garden/of/serenity.js:15:2\n" +
        "firefoxBar@file://sea/of/doom.js:20:3\n" +
        "@file:///path/to/index.html:23:1\n" + // inside <script> tag
        "",
        fileName: "http://lake/of/fire.js",
        columnNumber: 0,
        lineNumber: 703,
        result: 2147500037
    };

    public static IE11 = {
        message: "Unable to get property 'undef' of undefined or null reference",
        name: "TypeError",
        stack: "TypeError: Unable to get property 'undef' of undefined or null reference\n" +
        "   at Anonymous function (http://path/to/file.js:47:21)\n" +
        "   at iMakeErrors (http://path/to/file.js:45:13)\n" +
        "   at ngRootOfAllEvil (http://path/to/file.js:108:1)",
        description: "Unable to get property 'undef' of undefined or null reference",
        number: -2146823281
    };
}