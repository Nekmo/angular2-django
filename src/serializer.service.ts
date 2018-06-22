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
        let isSerializer = (type && type.prototype['__proto__'] &&
            type.prototype['__proto__'].constructor.name == 'SerializerService');
        target.constructor['fields'][key] = {
            typeName: (type ? type.name.toLowerCase() : ''), type: type, isSerializer: isSerializer,
            required: required, defaultValue: defaultValue,
            readOnly: readOnly, writeOnly: writeOnly, helpText: helpText,
        };
    }
}


// @Injectable({
//     providedIn: 'root'
// })
export class SerializerService {
    _api;

    constructor(api, data) {
        this._api = api;
        this.transformData(data);
        Object.assign(this, data);
    }

    transformData(data) {
        let fields = this.constructor['fields'];
        Object.entries(fields).forEach(([name, options]) => {
            let type = options['type'];
            if(options['isSerializer']) {
                data[name] = new type(this._api, data[name]);
            } else if(type) {
                data[name] = type(data[name]);
            }
        })
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

    getValue(name) {
        let value = this;
        name.split('__').forEach((item) => {
            value = value[item];
            if((value || {})['type'] == 'nested object') {
                value = value['children'];
            }
        });
        return value;
    }

    static getFieldOptions(field) {
        if(field.indexOf('__') >= 0) {
            let fields = field.split('__');
            let nextFields = fields.splice(1);
            let type_ = this.getNestedSerializer(fields[0]);
            if(type_.prototype['__proto__'].constructor.name == 'SerializerService') {
                return type_.getFieldOptions(nextFields.join('__'));
            } else {
                // TODO
            }
        }
        let fields = (this.prototype.constructor['fields'] || {});
        return (fields[field] || {})
    }

    static getNestedSerializer(field) {
        // if(field.indexOf('__')) {
        //     let fields = field.split('__');
        //     let nextFields = fields.splice(1);
        // }
        return this.getFieldOptions(field)['type'];
    }

    save() {
        return this._api.save(this.getPk(), this.getData());
    }
}
