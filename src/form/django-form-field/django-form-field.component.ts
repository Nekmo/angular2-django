import {
    Component, ComponentFactoryResolver, ContentChild,
    ContentChildren,
    Directive,
    ElementRef, Input,
    OnInit,
    QueryList,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {DjangoformControlItem} from "../django-form.service";


/** Interface used to provide an outlet for rows to be inserted into. */
export interface DjangoOutlet {
  viewContainer: ViewContainerRef;
}


/**
 * Provides a handle for the table to grab the view container's ng-container to insert data rows.
 * @docs-private
 */
@Directive({selector: '[djangoFormOutlet]'})
export class DataDjangoFormOutlet implements DjangoOutlet {
  constructor(public viewContainer: ViewContainerRef,
              public elementRef: ElementRef) { }
}


/**
 * The table template that can be used by the mat-table. Should not be used outside of the
 * material library.
 * @docs-private
 */
export const DJANGO_FORM_FIELD_TEMPLATE = `
<mat-form-field>
    <ng-container djangoFormOutlet></ng-container>
    <mat-hint *ngIf="helpText">{{ helpText }}</mat-hint>
</mat-form-field>
`;


@Component({
    selector: 'django-form-field',
    template: DJANGO_FORM_FIELD_TEMPLATE,
    styleUrls: ['./django-form-field.component.css']
})
export class DjangoFormFieldComponent implements OnInit {

    @Input() djangoFormControl: DjangoformControlItem;
    @ViewChild(DataDjangoFormOutlet) template: DataDjangoFormOutlet;

    // @ContentChild(DjangoColumnDef) formField: any;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    addComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.djangoFormControl.component);

        let viewContainerRef = this.template.viewContainer;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);

        Object.keys(this.djangoFormControl.data).forEach((key) => {
            (<any>componentRef.instance)[key] = this.djangoFormControl.data[key];
        });

    }

    ngOnInit(): void {
        this.addComponent();
    }

}
