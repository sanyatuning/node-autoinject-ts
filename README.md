# autoinject-ts

Dependency Injection Container for TypeScript with minimal configuration

## Usage

You only need to annotate classes with dependencies

Classes.ts
```typescript
import {autoinject} from 'autoinject-ts';

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
```


container.ts
```typescript
import {Container} from 'autoinject-ts';

const container = new Container();
export {
    container,
};
```


index.ts
```typescript
import {container} from './container';
import {B} from './Classes';

const b = container.get<B>(B);

b.hello();
// output: "Hello world!"
```

## API

Methods
* get\<T>(type: Class\<T>): T
* set\<T>(type: Class\<T>, instance: T): void
* setFactory\<T>(type: Class\<T>, factory: () => T): void
