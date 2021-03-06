import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {SerializerService} from "./serializer.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs/Rx";
import {isEqual} from "lodash";



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


export function Api(serializer) {
    return (constructor: Function) => {
        serializer['api_class'] = constructor;
    }
}


// @Injectable({
//     providedIn: 'root'
// })
export class ApiService {

    http: HttpClient;
    serializer: any;
    url: string;
    contentType: string;
    _queryParams = {};
    _options: Options;

    constructor(public injector: Injector) {
        this.http = injector.get(HttpClient);
    }

    get(pk) {
        return this.pipeHttp(this.http.get(this.getUrlDetail(pk)));
    }

    create(data) {
        return this.pipeHttp(this.http.post(this.getUrlList(), data, this.defaultHttpOptions()));
    }

    save(pk, data) {
        if(pk) {
            return this.patch(pk, data);
        } else {
            return this.create(data);
        }
    }

    patch(pk, data) {
        return this.pipeHttp(this.http.patch(this.getUrlDetail(pk), data, this.defaultHttpOptions()));
    }

    delete(pk = null) {
        let url: string;
        let options = this.defaultHttpOptions();
        if(pk == null) {
            url = this.getUrlList();
            options['params'] = this._queryParams;
        } else {
            url = this.getUrlDetail(pk)
        }
        return this.http.delete(url, options);
    }

    defaultHttpOptions() {
        return {headers: {'X-CSRFToken': getCookie('csrftoken') || ''}};
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
        if(!params) {
            return this;
        }
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
        Object.keys(params).forEach((key) => (params[key] == undefined) && delete params[key]);
        this._queryParams = Object.assign(this._queryParams, params);
    }

    _bulk_action(pks, action, data = undefined) {
        let options = this.defaultHttpOptions();
        if(pks == null) {
            options['params'] = this._queryParams;
        } else {
            options['params'] = new HttpParams().set('id__in', pks.join(','));
        }
        return this.http.post(`${this.getUrlList()}${action}/`, data, options);
    }

    bulk_update(data, pks = null) {
        return this._bulk_action(pks, 'bulk_update', data);
    }

    options() {

        return Observable.create((observer) => {
            // if(this._options) {
            //     observer.next(this._options);
            // } else {
            //     this.http.options(this.url).subscribe((options: Options) => {
            //         this._options = options;
            //         observer.next(options);
            //     });
            // }
            if(this.constructor['_options']) {
                observer.next(this.constructor['_options']);
            } else {
                this.http.options(this.url).subscribe((options: Options) => {
                    this.constructor['_options'] = options;
                    observer.next(options);
                });
            }
        });
    }

    all() {
        return this.pipeHttp(this.http.get(this.url, {params: this._queryParams}), true);
    }

    copy() {
        let api = new this['__proto__'].constructor(this.injector);
        api._queryParams = Object.assign({}, this._queryParams);
        return api;
    }

    isEqual(other) {
        return this.url == other.url && isEqual(this._queryParams, other._queryParams);
    }

    getOptionField(name, defaultValue?) {
        if(!this.constructor['_options']) {
            return
        }
        let data = this.constructor['_options'].actions.POST;

        let array = name.split('__');
        // name.split('__').forEach((item, i, array) => {
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            data = data[item];
            if(data === undefined && defaultValue === undefined) {
                throw new Error(`Invalid item ${item} on ${name} query`);
            } else if(data === undefined) {
                return defaultValue;
            }
            if(data['type'] == 'nested object' && i !== array.length - 1) {
                data = data['children'];
            }
        }
        return data;
    }

    getLabel(name) {
        return (this.getOptionField(name) || {})['label'];
    }

    getHelpText(name) {
        return (this.getOptionField(name, null) || {})['help_text'];
    }

    getChoices(name) {
        return (this.getOptionField(name) || {})['choices'];
    }

}
