import {
    Component, ContentChild,
    ContentChildren,
    Directive,
    ElementRef,
    OnInit,
    QueryList,
    ViewChild,
    ViewContainerRef
} from '@angular/core';


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
<ng-container djangoFormOutlet></ng-container>
`;


@Component({
    selector: 'django-form-field',
    template: DJANGO_FORM_FIELD_TEMPLATE,
    styleUrls: ['./django-form-field.component.css']
})
export class DjangoFormFieldComponent implements OnInit {

    @ViewChild(DataDjangoFormOutlet) _rowOutlet: DataDjangoFormOutlet;

    // @ContentChild(DjangoColumnDef) formField: any;

    constructor() { }

    ngOnInit() {
    }

}
