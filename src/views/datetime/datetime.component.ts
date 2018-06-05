import {Component, Input, OnInit} from '@angular/core';


import * as moment from 'moment';
import * as locales from 'moment/min/locales';
import 'moment-duration-format';

moment.locale('es');


@Component({
    selector: 'time-ago',
    templateUrl: './time-ago.component.html',
    styleUrls: ['./time-ago.component.scss']
})
export class TimeAgoComponent implements OnInit {

    @Input() dt: Date;
    @Input('prefix-text') prefixText: string = 'Hace';

    constructor() { }

    ngOnInit() {
    }

}

@Component({
    selector: 'countdown',
    templateUrl: './countdown.component.html',
})
export class CountdownComponent implements OnInit {

    @Input() dt: Date;

    constructor() { }

    ngOnInit() {
    }

}


@Component({
    selector: 'duration',
    templateUrl: './duration.component.html',
})
export class DurationComponent implements OnInit {

    @Input() seconds: number;
    duration;

    constructor() { }

    ngOnInit() {
        this.duration = moment.duration(this.seconds, "seconds").format("h [hrs]: m [min]: s [sec]")
    }

}
