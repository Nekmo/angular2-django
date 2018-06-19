import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {isArray, isString} from "util";


function getField (data, api){
    if(isString(data)) {
        data = {"field": data};
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
    if(!data['flex']) {
        data['flex'] = 100;
    }
    data['placeholder'] = api.getLabel(data['field']);
    data['help_text'] = api.getHelpText(data['field']);
    return data;
}

function getControlConfig(field, value = '') {
    let config: any[] = [];
    let data = {};
    data['disabled'] = field['disabled'] || false;
    data['value'] = field['default'] || '';
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

    constructor(public formBuilder: FormBuilder) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initForm();
    }

    initForm() {
        let controlsConfig = {};
        this.api.options().subscribe(() => {
            this.schema = this.fields.map((itemsArray) => {
                if(!isArray(itemsArray)){
                    itemsArray = [itemsArray];
                }
                return itemsArray.map((item) => {
                    let field = getField(item, this.api);
                    let value: any = '';
                    if(this.instance) {
                        value = this.instance.getValue(field['field']);
                    }
                    controlsConfig[field['field']] = getControlConfig(item, value);
                    return field;
                });
            });

            this.form = this.formBuilder.group(controlsConfig);

        });
    }

    onFormSubmit() {}

}
