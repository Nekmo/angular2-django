import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DjangoFormComponent} from "./django-form/django-form.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatNativeDateModule, MatAutocompleteModule,
    MatSelectModule, MatSnackBarModule, MatStepperModule, MatInput,
} from "@angular/material";import {DjangoSearchInputComponent} from "./django-search-input/django-search-input.component";
import {DataDjangoFormOutlet, DjangoFormFieldComponent} from "./django-form-field/django-form-field.component";
import {DjangoInput} from "./django-form.service";

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

        DjangoInput,
    ],
    exports: [
        DjangoFormComponent,
        DjangoSearchInputComponent,
        DjangoFormFieldComponent,

        DjangoInput,
    ],
    entryComponents: [

        DjangoSearchInputComponent,
        DjangoFormFieldComponent,

        DjangoInput,
    ]
})
export class DjangoFormModule { }
