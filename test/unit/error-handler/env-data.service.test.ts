import { RoutesRecognized, NavigationCancel } from "@angular/router";
import { Subject } from "rxjs";
import { EnvironmentDataService } from "../../../src";

class StubInjector {
	$events: Subject<any>;
	get(anything: any): any {
		if(this.$events) {
			return this.$events;
		}

		this.$events = new Subject();

		return {events: this.$events};
	}
}

describe("EnvironmentDataService", () => {
	it("When environment data is retrieved before all interactions initial values are returned", () => {
		//arrange
		let injector = new StubInjector();
		let envDataService = new EnvironmentDataService(injector);

		//act
		envDataService.init();
		let envData = envDataService.getEnvironmentData();

		//assert
		expect(envDataService).toBeDefined("Should be able to instantiate the injector");
		expect(envData.ua).toBeDefined("User Agent data should be defined all the time");
		expect(envData.urls.urls.length).toEqual(0, "List of visited urls should be empty initially");
	});

	it("When route is changed we add url as visited", () => {
		//arrange
		let injector = new StubInjector();
		let envDataService = new EnvironmentDataService(injector);

		//act
		envDataService.init();
		let urls = injector.get({});
		urls.next(new RoutesRecognized(1,"some/url/here", "some/url/here", null));

		let envData = envDataService.getEnvironmentData();

		//assert
		expect(envDataService).toBeDefined("Should be able to instantiate the injector");
		expect(envData.ua).toBeDefined("User Agent data should be defined all the time");
		expect(envData.urls.urls.length).toEqual(1, "List of visited urls should be 1");
		expect(envData.urls.urls[0]).toEqual("some/url/here", "The visited url didnt match");
	});

	it("When navigation cancelled url is not added to visited urls", () => {
		//arrange
		let injector = new StubInjector();
		let envDataService = new EnvironmentDataService(injector);

		//act
		envDataService.init();
		let urls = injector.get({});

		urls.next(new NavigationCancel(1,"this/url/cancelled", "because of reasons"));
		urls.next(new RoutesRecognized(1,"some/url/here", "some/url/here", null));

		let envData = envDataService.getEnvironmentData();

		//assert
		expect(envDataService).toBeDefined("Should be able to instantiate the injector");
		expect(envData.ua).toBeDefined("User Agent data should be defined all the time");
		expect(envData.urls.urls.length).toEqual(1, "List of visited urls should be 1");
		expect(envData.urls.urls[0]).toEqual("some/url/here", "The visited url didnt match");
	});

});

