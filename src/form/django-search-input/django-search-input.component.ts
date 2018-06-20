import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR, FormControl} from "@angular/forms";
import {_} from "../django-form/django-form.component";
import {MatInput, MatAutocomplete, MatAutocompleteTrigger} from '@angular/material';
import {HttpClient} from "@angular/common/http";

// https://stackoverflow.com/questions/39661430/angular-2-formcontrolname-inside-component
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DjangoSearchInputComponent),
    multi: true
};



@Component({
    selector: 'django-search-input',
    templateUrl: './django-search-input.component.html',
    styleUrls: ['./django-search-input.component.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class DjangoSearchInputComponent implements OnInit {

    @Input() input: {};
    @Input() form: any;
    @Input() queryset: any;

    //current form control input. helpful in validating and accessing form control
    @Input() c:FormControl = new FormControl();

    // get reference to the input element
    @ViewChild('input')  inputRef:ElementRef;
    @ViewChild(MatInput) searchInput: MatInput;
    @ViewChild(MatAutocomplete) auto: MatAutocomplete;
    @ViewChild(MatAutocompleteTrigger) autoTrigger: MatAutocompleteTrigger;


    //The internal data model for form control value access
    private innerValue: any = '';
    private lastTerm: string;
    errors: any[];
    private items;
    private lastOption;

    constructor() { }

    ngOnInit() {
        // RESET the custom input form control UI when the form control is RESET
        this.c.valueChanges.subscribe(
            () => {
                // check condition if the form control is RESET
                if (this.c.value == "" || this.c.value == null || this.c.value == undefined) {
                    this.innerValue = "";
                    this.inputRef.nativeElement.value = "";
                }
            }
        );

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

    // event fired when input value is changed . later propagated up to the form control using the custom value accessor interface
    onChange(e:Event, value:any){
        //set changed value
        this.innerValue = value;
        // propagate value into form control using control value accessor interface
        this.propagateChange(this.innerValue);

        //reset errors
        this.errors = [];
        //setting, resetting error messages into an array (to loop) and adding the validation messages to show below the field area
        for (var key in this.c.errors) {
            if (this.c.errors.hasOwnProperty(key)) {
                if(key === "required"){
                    this.errors.push("This field is required");
                }else{
                    this.errors.push(this.c.errors[key]);
                }
            }
        }
    }

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
        }
    }

    //propagate changes into the custom form control
    propagateChange = (_: any) => { }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        this.innerValue = value;
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {

    }
    
    searchWord(term){
        if(term == this.lastTerm) {
            return;
        }
        this.queryset.search(term).all().subscribe((items) => {
            this.items = items;
            this.lastTerm = term;
        })
    }

    searchClick() {
        this.searchInput.value = '';
        this.searchWord('');
    }

    focusOut() {
        this.setItem(this.lastOption);
    }

    selected(event) {
        this.setItem(event.option);
        this.searchInput['_elementRef'].nativeElement.blur();
        // this.searchInput.nativeElement.blur();
    }

    setItem(option) {
        if(!option) {
            return
        }
        this.lastOption = option;
        this.searchInput.value = option.value.getName();
    }

    clear() {
        this.lastOption = null;
        this.searchInput.value = '';
        this.searchWord('');
        setTimeout(() => {
            this.autoTrigger.openPanel();
        });
    }

}
