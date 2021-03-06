import { Injectable } from '@angular/core';


// TODO: remove
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


export function Field(type?: any, many: boolean = false, required: boolean = true, defaultValue?: any,
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
            many: many,
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
        let fields = this.constructor['fields'] || {};
        if(data === null) {
            // Instance is null on model
            return null
        }
        Object['entries'](fields).forEach(([name, options]) => {
            let type = options['type'];
            if(data[name] === undefined || data[name] === null) {
                return
            }
            if(options['isSerializer'] && options['many']) {
                // TODO: no es su propio serializer
                data[name] = data[name].map((item) => new type(this.getSerializerApi(type), item));
            } else if(options['isSerializer']) {
                // TODO: no es su propio serializer
                data[name] = new type(this.getSerializerApi(type), data[name]);
            } else if(type == Date) {
                data[name] = (data[name] ? new type(data[name]) : data[name]);
            } else if(type) {
                data[name] = type(data[name]);
            }
        })
    }

    getSerializerApi(serializer) {
        const api_class = serializer['api_class'];
        if(!api_class) {
            throw Error(`api_class is not available in ${serializer}`)
        }
        return this._api.injector.get(api_class);
    }

    getData(item = null) {
        item = item || this;
        let newData = {};
        Object.keys(item).forEach((key) => {
            if(key.startsWith('_')) {
                return;
            }
            let value = item[key];
            if(Array.isArray(value)) {
                value = value.map((x) => this.getData(x), value);
            }
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
            if(value === undefined) {
                // TODO: Nested item is not defined. Maybe a empty translation. Improve required.
                return;
            }
            value = value[item];
            if((value || {})['type'] == 'nested object') {
                value = value['children'];
            }
        });
        return value;
    }

    getDisplayName(field) {
        let value = this.getValue(field);
        if(!value) {
            return '';
        }
        let choices = this._api.getChoices(field);
        let parts = field.split('__');
        return choices.find((option) => option['value'] == value )['display_name'];
    }

    static getFieldOptions(field) {
        if(field.indexOf('__') >= 0) {
            let fields = field.split('__');
            let nextFields = fields.splice(1);
            let type_ = this.getNestedSerializer(fields[0]);
            if(type_ === undefined) {
                throw new Error(`Missing serializer for ${fields[0]} on ${field}`);
            }
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

    static getType(field) {
        return this.getNestedSerializer(field);
    }

    patch(data) {
        // TODO: este método se eliminará en un futuro. Sólo usar patch.
        return this._api.save(this.getPk(), data);
    }

    save() {
        // TODO: getData es conveniente que sólo envíe la información que haya cambiado.
        return this._api.save(this.getPk(), this.getData());
    }

    delete() {
        return this._api.delete(this.getPk());
    }
}
