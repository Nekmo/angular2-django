import { Injectable } from '@angular/core';


// TODO: remove
export function InputConverter(converter?: (api, value: any) => any) {
    return (target: Object, key: string) => {
        console.log(target);
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


export function Field(type?: any, required: boolean = true, defaultValue?: any,
                      readOnly: boolean = false, writeOnly: boolean = false,
                      helpText?: string) {
    return (target: Object, key: string) => {
        let metadata = (<any>Reflect).getMetadata("design:type", target, key);
        if(!type) {
            type = metadata;
        }
        if(target.constructor['fields'] === undefined) {
            target.constructor['fields'] = {};
        }
        target.constructor['fields'][key] = {
            type: type, required: required, defaultValue: defaultValue,
            readOnly: readOnly, writeOnly: writeOnly, helpText: helpText,
        };
        console.log(target);
    }
}


// @Injectable({
//     providedIn: 'root'
// })
export class SerializerService {
    _api;

    constructor(api, data) {
        this._api = api;
        Object.assign(this, data);
    }

    getData() {
        let newData = {};
        Object.keys(this).forEach((key) => {
            if(key.startsWith('_')) {
                return;
            }
            let value = this[key];
            if(value && value['getData']) {
                value = value['getData']();
            }
            newData[key] = value;
        });
        return newData;
    }

    getPk() {
        return this['id'];
    }

    save() {
        return this._api.save(this.getPk(), this.getData());
    }
}
