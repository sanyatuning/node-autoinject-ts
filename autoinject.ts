export function autoinject() {
    return function(target: any) {
        Reflect.getMetadata('design:paramtypes', target);
        return target;
    };
}
