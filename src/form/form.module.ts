import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DjangoFormComponent} from "./django-form/django-form.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatNativeDateModule,
    MatSelectModule, MatSnackBarModule, MatStepperModule
} from "@angular/material";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

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
    ],
    exports: [
        DjangoFormComponent,
    ]
})
export class DjangoFormModule { }
