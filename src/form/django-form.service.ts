import {Component, ComponentFactoryResolver, Inject, Injectable, Injector, Input, Type, ViewChild} from "@angular/core";
import {DjangoSearchInputComponent} from "./django-search-input/django-search-input.component";
import {FormControl, FormGroup} from "@angular/forms";
import {MatInput} from "@angular/material";


@Component({
  selector : 'django-input',
    template: `<input matInput (keyup)="setValue(input.value);">`,
})
export class DjangoInput {
    @Input() formControl: FormControl;
    @ViewChild(MatInput) input: MatInput;

    setValue(value) {
        this.formControl.patchValue(value);
    }

}


export const DEFAULT_WIDGETS = {
    'string': DjangoInput,
    'default': DjangoInput,
    // 'django-search-input': DjangoSearchInputComponent,
    // 'default': DjangoInput,
};


export class DjangoformControlItem {
  constructor(public component: Type<any>, public data: any) {}
}


export class DjangoForm {
    widgets: any[];
    form: FormGroup;

    constructor(private api: any, public fieldNames: string[], public service) {
        this.api.options().subscribe(() => {
            let form = {};
            this.widgets = this.fieldNames.map((fieldName) => {
                const type = this.api.serializer.getType(fieldName);
                const options = this.api.serializer.getFieldOptions(fieldName);
                let component = DEFAULT_WIDGETS[type] || DEFAULT_WIDGETS['default'];
                let data = {
                    'placeholder': this.api.getLabel(fieldName) || fieldName,
                };
                if(options['isSerializer']) {
                    component = DjangoSearchInputComponent;
                    data['queryset'] = this.service.injector.get(options['type']['api_class']);
                }
                form[fieldName] = new FormControl('');
                data['formControl'] = form[fieldName];
                return new DjangoformControlItem(component, data);
            });
            this.form = new FormGroup(form);
        });
    }
}


@Injectable({
    providedIn: 'root'
})
export class DjangoFormService {
    factoryResolver: any;
    rootViewContainer: any;

    constructor(
        @Inject(ComponentFactoryResolver) factoryResolver,
        public injector: Injector,
        // @Inject(ViewContainerRef) viewContainerRef,
        ) {
        this.factoryResolver = factoryResolver;
        // this.rootViewContainer = viewContainerRef;
    }

    getFilter(api, fields) {
        return new DjangoForm(api, fields, this);
    }
}