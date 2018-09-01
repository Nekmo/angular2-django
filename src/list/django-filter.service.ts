import {
    Component,
    Inject,
    Injectable,
    ComponentFactoryResolver,
    ViewContainerRef,
    Input,
    TemplateRef, Injector, ViewChild
} from "@angular/core";
import {DynamicItem} from "../dynamic-component.component";
import {DjangoSearchInputComponent} from "../form/django-search-input/django-search-input.component";
import {FormControl, FormGroup} from "@angular/forms";
import {MatInput} from "@angular/material";


@Component({
  selector: 'django-input',
    template: `
        <mat-form-field>
            <input matInput [placeholder]="placeholder" [type]="type" #input (keyup)="setValue(input.value);">
            <mat-hint *ngIf="helpText">{{ helpText }}</mat-hint>
        </mat-form-field>
    `
})
export class DjangoInput {
    @Input() type: string = 'text';
    @Input() placeholder: string;
    @Input() helpText: string;
    @Input() formControl: FormControl;

    @ViewChild(MatInput) input: MatInput;

    setValue(value) {
        this.formControl.patchValue(value);
    }
}


export const DEFAULT_FILTERS = {
    'string': DjangoInput,
    'django-search-input': DjangoSearchInputComponent,
    'default': DjangoInput,
};


export class DjangoFilter {
    inputs: any[];
    form: FormGroup;

    constructor(private api: any, public fieldNames: string[], public service) {
        this.api.options().subscribe(() => {
            let form = {};
            this.inputs = this.fieldNames.map((fieldName) => {
                const type = this.api.serializer.getType(fieldName);
                const options = this.api.serializer.getFieldOptions(fieldName);
                let component = DEFAULT_FILTERS[type] || DEFAULT_FILTERS['default'];
                let data = {
                    'placeholder': this.api.getLabel(fieldName) || fieldName,
                };
                if(options['isSerializer']) {
                    component = DjangoSearchInputComponent;
                    data['queryset'] = this.service.injector.get(options['type']['api_class']);
                }
                form[fieldName] = new FormControl('');
                data['formControl'] = form[fieldName];
                // data['c'] = form[fieldName];
                return new DynamicItem(component, data);
                // return component;
            });
            this.form = new FormGroup(form);
        });
    }
}


@Injectable({
    providedIn: 'root'
})
export class DjangoFilterService {
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
        return new DjangoFilter(api, fields, this);
    }
}