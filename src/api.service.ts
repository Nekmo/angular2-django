import {Injectable, Injector} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SerializerService} from "./serializer.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs/Rx";



export class PagedList extends Array {
    count: number;

    constructor(items?: Array<any>) {
        super(...items);
    }
}


export class Options {

    actions: {
        POST: {},
        description: string,
        name: string,
    };
    parsers: string[];
    renders: string[];
}


export function getCookie(name) {
   if (!document.cookie) {
       return null;
   }

   const xsrfCookies = document.cookie.split(';')
       .map(c => c.trim())
       .filter(c => c.startsWith(name + '='));

   if (xsrfCookies.length === 0) {
       return null;
   }

   return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}


// @Injectable({
//     providedIn: 'root'
// })
export class ApiService {

    serializer: any;
    url: string;
    _queryParams = {};
    _options: Options;

    constructor(public http: HttpClient,
                public injector: Injector) { }


    get(pk) {
        return this.pipeHttp(this.http.get(this.getUrlDetail(pk)));
    }

    create(data) {
        return this.pipeHttp(this.http.post(this.getUrlList(), data,
            {headers: {'X-CSRFToken': getCookie('csrftoken') || ''}}));
    }

    save(pk, data) {
        return this.pipeHttp(this.http.put(this.getUrlDetail(pk), data,
            {headers: {'X-CSRFToken': getCookie('csrftoken') || ''}}));
    }

    patch(pk, data) {
        return this.pipeHttp(this.http.patch(this.getUrlDetail(pk), data,
            {headers: {'X-CSRFToken': getCookie('csrftoken') || ''}}));
    }

    delete(pk) {
        return this.http.delete(this.getUrlDetail(pk), {headers: {'X-CSRFToken': getCookie('csrftoken') || ''}});
    }

    pipeHttp(observable, listMode = false) {
        return observable.pipe(
            map((resp) => this.convert(resp, listMode))
        );
    }

    convert(data, listMode) {
        if(listMode) {
            let items = data['results'] || data;
            items = new PagedList(items.map((item) => new this.serializer(this, item)));
            items.count = data['count'] || items.length;
            return items;
        }
        return new this.serializer(this, data);
    }

    getUrlDetail(pk) {
        return `${this.url}${pk}/`;
    }

    getUrlList() {
        return `${this.url}`;
    }

    orderBy(...orderList: string[]) {
        let order: string = orderList.join(',');
        let item = this.copy();
        item.setParams({'ordering': order});
        return item;
    }

    search(query) {
        let item = this.copy();
        item.setParams({'search': query});
        return item;
    }

    filter(params) {
        let item = this.copy();
        item.setParams(params);
        return item;
    }

    page(page: number = 1, page_size: number = undefined) {
        let item = this.copy();
        item.setParams({'page': page, 'page_size': page_size});
        return item;
    }

    setParams(params) {
        this._queryParams = Object.assign(this._queryParams, params);
    }

    options() {
        return Observable.create((observer) => {
            if(this._options) {
                observer.next(this._options);
            } else {
                this.http.options(this.url).subscribe((options: Options) => {
                    this._options = options;
                    observer.next(options);
                });
            }
        });
    }

    all() {
        return this.pipeHttp(this.http.get(this.url, {params: this._queryParams}), true);
    }

    copy() {
        let api = new this['__proto__'].constructor(this.http);
        api._queryParams = Object.assign({}, this._queryParams);
        return api;
    }

    getOptionField(name) {
        if(!this._options) {
            return
        }
        let data = this._options.actions.POST;
        name.split('__').forEach((item, i, array) => {
            data = data[item];
            if(data === undefined) {
                throw new Error(`Invalid item ${item} on ${name} query`);
            }
            if(data['type'] == 'nested object' && i !== array.length - 1) {
                data = data['children'];
            }
        });
        return data;
    }

    getLabel(name) {
        return (this.getOptionField(name) || {})['label'];
    }

    getHelpText(name) {
        return (this.getOptionField(name) || {})['help_text'];
    }

}
