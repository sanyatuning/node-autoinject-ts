import 'reflect-metadata';

const isNativeRegex = /\{\s*\[native code\]\s*\}/;
const constructorRegex = /constructor\((.+)\)/;

export interface Class<T> {
    new (...args: any[]): T;
}

export class Container {
    private factories = new Map<any, any>();
    private instances = new Map<any, any>();

    get<T>(type: Class<T>): T {
        return this.getInternal(type);
    }

    set<T>(type: Class<T>, instance: T): void {
        this.instances.set(type, instance);
    }

    setFactory<T>(type: Class<T>, factory: () => T): void {
        this.factories.set(type, factory);
    }

    private getInternal = <T>(type: Class<T>, pos = ''): T => {
        assertType(type, pos);
        if (this.instances.has(type)) {
            return this.instances.get(type);
        }

        let inst;
        if (this.factories.has(type)) {
            const factory = this.factories.get(type);
            inst = factory();
        } else {
            const params = this.getParamsFor(type, pos);
            inst = new type(...params) as any;
        }
        this.instances.set(type, inst);

        return inst;
    }

    private getParamsFor<T>(type: Class<T>, pos: string) {
        const nextPos = (pos ? pos + ' -> ' : '') + (type && type.name);
        const defaults = getDefaultValues(type);
        const paramTypes = defaults.length ? getParamTypes(type) : [];

        return paramTypes.map((b: any, index: number) => {
            try {
                return this.getInternal(b, nextPos);
            } catch (e) {
                const defaultValue = defaults[index];
                if (typeof defaultValue === 'undefined') {
                    throw e;
                }
                return defaultValue;
            }
        });
    }


}

function assertType<T>(type: Class<T>, pos: string) {
    if (typeof type !== 'function') {
        throw new Error('Dependency on "' + type + '": ' + pos);
    }
    if (isNative(type)) {
        throw new Error('Dependency on native "' + type.name + '": ' + pos);
    }
}

function isNative<T>(type: Class<T>) {
    return isNativeRegex.test('' + type);
}

function getParamTypes<T>(type: Class<T>) {
    const metadata = Reflect.getMetadata('design:paramtypes', type);
    if (!metadata) {
        throw new Error('Missing @autoinject() annotation for "' + type.name + '"');
    }
    return Array.prototype.slice.call(metadata);
}

function getDefaultValues<T>(type: Class<T>): any[] {
    try {
        const match = constructorRegex.exec('' + type);
        const paramDef = match ? match[1].split(/,\s*/) : [];

        return paramDef.map((def) => {
            const match = /=\s*(.*)$/.exec(def);
            if (!match) {
                return undefined;
            }
            // tslint:disable-next-line
            return eval('(' + match[1] + ')');
        });
    } catch (e) {
        return [];
    }
}
