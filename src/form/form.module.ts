import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DjangoFormComponent} from "./django-form/django-form.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatNativeDateModule, MatAutocompleteModule,
    MatSelectModule, MatSnackBarModule, MatStepperModule
} from "@angular/material";
import {DjangoSearchInputComponent} from "./django-search-input/django-search-input.component";
import {DataDjangoFormOutlet, DjangoFormFieldComponent} from "./django-form-field/django-form-field.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatCheckboxModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatSnackBarModule,
        FlexLayoutModule,

    ],
    declarations: [
        DjangoFormComponent,
        DjangoSearchInputComponent,
        DjangoFormFieldComponent,
        DataDjangoFormOutlet,
    ],
    exports: [
        DjangoFormComponent,
        DjangoSearchInputComponent,
        DjangoFormFieldComponent,
    ],
    entryComponents: [
        DjangoSearchInputComponent,
        DjangoFormFieldComponent,
    ]
})
export class DjangoFormModule { }
