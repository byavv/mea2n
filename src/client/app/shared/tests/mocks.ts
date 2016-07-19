import { Observable, ReplaySubject } from "rxjs";
export class MockRouter {
    navigate(value) { }
}
export class MockAppController {
    init$: ReplaySubject<any> = new ReplaySubject<any>()
    start() {
        this.init$.next({
            defaults: [{ some: 'property' }]
        })
    }
    get converters() { return [] }
}
export class MockApiService {
    loadDefaults() { }
}

export class MockResponseHandler {
    handleError(er) { return er.toString() }
}
export class ServerResponse {
    json() {
        return { some: "prop" }
    }
}