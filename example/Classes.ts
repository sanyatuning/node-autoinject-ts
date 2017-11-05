import {autoinject} from '../index';

// no constructor -> no annotation
export class A {
    public who = 'world';
}

@autoinject()
export class B {
    constructor(public a: A) {}

    hello() {
        console.log('Hello ' + this.a.who + '!')
    }
}
