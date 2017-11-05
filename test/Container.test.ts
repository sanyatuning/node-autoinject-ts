import {Expect, Test} from 'alsatian';
import {Container} from '../Container';
import {autoinject} from '../autoinject';


export class ContainerTest {

    @Test()
    public simple() {
        const container = new Container();
        const b = container.get<B>(B);
        Expect(b).toEqual({
            a: {
                field: 'A'
            },
            field: 'B'
        });
    }

    @Test()
    public singleton() {
        const container = new Container();
        const b1 = container.get<B>(B);
        const b2 = container.get<B>(B);
        Expect(b1).toBe(b2);
        Expect(b1.a).toBe(b2.a);
    }

    @Test()
    public missingAnnotationError() {
        const container = new Container();
        Expect(() => container.get(C))
            .toThrowError(Error, 'Missing @autoinject() annotation for "C": C');
    }

    @Test()
    public nativeClassError() {
        const container = new Container();
        Expect(() => container.get(D))
            .toThrowError(Error, 'Dependency on native "Object": D -> Object');
    }

    @Test()
    public defaultValue() {
        const container = new Container();
        const e = container.get(E);
        Expect(e).toEqual({
            a: {
                field: 'A'
            },
            options: {},
            field: 'E'
        });
    }
}


class A {
    public field = 'A';
}

@autoinject()
class B {
    public field = 'B';

    constructor(public a: A) {

    }
}

class C {
    public field = 'C';

    constructor(public c: B) {

    }
}

@autoinject()
class D {
    public field = 'D';

    constructor(public a: A, public options: object) {

    }
}
@autoinject()
class E {
    public field = 'E';

    constructor(public a: A, public options: object = {}) {

    }
}
