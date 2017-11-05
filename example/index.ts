import {container} from './container';
import {B} from './Classes';

const b = container.get<B>(B);

b.hello();
// output: "Hello world!"
