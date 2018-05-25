import { Injectable } from '@angular/core';


export function InputConverter(converter?: (api, value: any) => any) {
    return (target: Object, key: string) => {
        if (converter === undefined) {
            let metadata = (<any>Reflect).getMetadata("design:type", target, key);
            if (metadata === undefined || metadata === null)
                throw new Error("The reflection metadata could not be found.");

            // if (metadata.name === "String")
            //     converter = StringConverter;
            // else if (metadata.name === "Boolean")
            //     converter = BooleanConverter;
            // else if (metadata.name === "Number")
            //     converter = NumberConverter;
            // else
            //     throw new Error("There is no converter for the given property type '" + metadata.name + "'.");
        }

        let definition = Object.getOwnPropertyDescriptor(target, key);
        if (definition) {
            Object.defineProperty(target, key, {
                get: definition.get,
                set: newValue => {
                    definition.set(converter(this.api, newValue));
                },
                enumerable: true,
                configurable: true
            });
        } else {
            Object.defineProperty(target, key, {
                get: function () {
                    return this["__" + key];
                },
                set: function (newValue) {
                    // TODO: API
                    this["__" + key] = converter(this.api, newValue);
                },
                enumerable: true,
                configurable: true
            });
        }
    };
}


// @Injectable({
//     providedIn: 'root'
// })
export class SerializerService {
    api;

    constructor(api, data) {
        this.api = api;
        Object.assign(this, data);
    }
}
