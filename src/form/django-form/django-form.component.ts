import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {isArray, isString} from "util";
import {Observable} from "rxjs/Rx";
import {catchError} from "rxjs/internal/operators";
import {MatSnackBar} from "@angular/material";
import {lookupsToDicts} from "../../utils";



export function _(str: string) {
  return str;
}


const TYPE_WIDGETS = {
    "boolean": {"widget": "checkbox"},
    "date": {"widget": "datetime"},
};


function getField(data, api){
    if(isString(data)) {
        data = {"field": data};
    }
    if(!data['field']) {
        return
    }
    if(data['widget'] === undefined) {
        let options = api.serializer.getFieldOptions(data['field']);
        let type = options['typeName'];
        Object.assign(data, TYPE_WIDGETS[type] || {});
        if(options['isSerializer']) {
            data['widget'] = 'search-input';
            let apiClass = options['type']['api_class'];
            data['queryset'] = data['queryset'] || api.injector.get(apiClass);
        }
    }
    if(data['required'] === undefined) {
        data['required'] = true;
    }
    if(data['widget'] === undefined) {
        data['widget'] = "input";
    }
    if(data['widget'] == "input" && data['type'] === undefined) {
        data['type'] = "text";
    }
    if(data['widget'] == "input" && data['type'] == 'hidden') {
        data['type'] = "text";
        data['display'] = "none";
    }
    if(data['widget'] == "select" && !data['choices']) {
        data['choices'] =  api.getChoices(data['field']);
        data['value_key'] = 'value';
    }
    if(!data['flex']) {
        data['flex'] = 100;
    }
    data['placeholder'] = data['placeholder'] || api.getLabel(data['field']);
    data['help_text'] = data['help_text'] || api.getHelpText(data['field']);
    return data;
}

function getControlConfig(field, value = '') {
    let config: any[] = [];
    let data = {};
    data['disabled'] = field['disabled'] || false;
    if(field['default'] === undefined) {
        data['value'] =  '';
    } else {
        data['value'] = field['default'];
    }
    data['value'] = value || field['default'];

    config.push(data);
    if(field['required']) {
        config.push(Validators.required);
    }
    return config;
}


@Component({
    selector: 'django-form',
    templateUrl: './django-form.component.html',
    styleUrls: ['./django-form.component.css']
})
export class DjangoFormComponent implements OnInit, OnChanges {

    schema: any;
    form: FormGroup;
    @Input() api: any;
    @Input() instance: any;
    @Input() fields: any[] = [];
    @Input() update: 'PUT' | 'PATCH' = 'PUT';
    @Input() inline: boolean = false;
    @Input() buttons: boolean = true;
    @Input() populate: {};
    @Input() translationsField: string = 'translations';
    @Input() translations: {name: string, code: string}[] = [];

    constructor(public formBuilder: FormBuilder,
                public snackBar: MatSnackBar) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initForm();
    }

    getFields() {
        let fields = Object.assign([], this.fields);
        for(let field of this.fields) {
            let fieldName = (isString(field) ? field : field['field']);
            if(!fieldName || !fieldName.startsWith(`${this.translationsField}__`)) {
                continue;
            }
            const index = fields.indexOf(field);
            fields.splice(index, 1);
            for(let translation of this.translations) {
                let parts = fieldName.split('__');
                parts.splice(1, 0, translation['code']);
                let transFieldName = parts.join('__');

                let field_ = (isString(field) ? {} : Object.assign({}, field));
                field_['field'] = transFieldName;
                // if(isString(fieldName)) {
                //     field_ = {'field': fieldName};
                // } else {
                //     field_ = field.slice();
                //     field_['field'] = fieldName
                // }
                fields.splice(index, 0, field_);
            }
        }
        return fields;
    }

    initForm() {
        let controlsConfig = {};
        this.api.options().subscribe(() => {
            this.schema = this.getFields().map((itemsArray) => {
                if(!isArray(itemsArray)){
                    itemsArray = [itemsArray];
                }
                return itemsArray.map((item) => {
                    let field = getField(item, this.api);
                    if(!field) {
                        return item;
                    }
                    let value: any = '';
                    if(this.instance) {
                        value = this.instance.getValue(field['field']);
                    } else if(this.populate && this.populate[field['field']]) {
                        value = this.populate[field['field']];
                    }
                    controlsConfig[field['field']] = getControlConfig(item, value);
                    return field;
                });
            });

            this.form = this.formBuilder.group(controlsConfig);
            this.formInitialized();
        });
    }

    formInitialized() {
    }

    getErrorMessage(field) {
        let err = field.hasError('required') ? _('You must enter a value') :
            field.hasError('email') ? _('Not a valid email') :
                '';
        if(!err){
            let errList = Object.keys(field.errors);
            err = errList.join(', ');
            console.log(err);
        }
        return err;
    }

    getFieldOptions(field) {
        let inputs = [].concat(...this.schema);
        return inputs.find(x => x.field == field);
    }

    getDefaultValue(field) {
        return this.getFieldOptions(field)['default'];
    }

    getApiMethod(data) {
        if(this.instance && this.update == 'PUT') {
            return this.api.save(this.instance.id, data);
        } else if(this.instance && this.update == 'PATCH') {
            return this.api.patch(this.instance.id, data);
        } else {
            return this.api.create(data);
        }
    }

    processData(data) {
        return data;
    }

    onFormSubmit(data, onSuccess=null) {
        Object.entries(data).forEach(([key, value]) => {
            if(value && value['getData']) {
                data[key] = value['getData']();
            }
        });
        data = lookupsToDicts(data);
        data = this.processData(data);
        this.getApiMethod(data)
            .pipe(catchError((err, caught) => {
                if(!err.error) {
                    alert(err);
                    return
                }
                Object.keys(err.error).forEach(key => {
                    let value = err.error[key];
                    let errorDict = {};
                    for (let item of value) {
                        errorDict[item] = true;
                    }
                    if(this.form.controls[key]) {
                        this.form.controls[key].setErrors(errorDict);
                    }
                });
                return Observable.empty();
            }))
            .subscribe(() => {
                this.snackBar.open('Success', 'Close', {
                    duration: 3000,
                });
                if(onSuccess) {
                    onSuccess();
                }
            });
    }

}
