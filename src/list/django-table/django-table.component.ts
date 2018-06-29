import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatInput, MatPaginator, MatSort, MatSortable} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {Options} from "../../api.service";
import {isString} from "util";

@Component({
  selector: 'django-table',
  templateUrl: './django-table.component.html',
  styleUrls: ['./django-table.component.scss']
})
export class DjangoTableComponent implements OnInit, OnChanges {

    routerPage: string;
    defaultPageIndex: number = 10;
    options: Options;

    items: any[] = [];
    params = {};
    firstLoad = true;
    itemsLength: number = 0;
    displayedColumns: string[] = [];

    @Input() queryset: any;
    @Input() columns: any;
    @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatInput) searchInput: MatInput;

    constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.routerPage = this.router.url.split('?')[0].split('#')[0];
        this.queryset.options().subscribe((options) => {
            this.options = options;
        });

        this.setListeners();
        this.afterOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['columns']) {
            this.setColumns();
        }
    }

    afterOnInit() {}

    setListeners() {
        this.paramsChangeListener();
        this.sortChangeListener();
        this.pageChangeListener();
    }

    setColumns() {
        if(!this.columns) {
            return;
        }
        this.displayedColumns = this.columns.map((item) => {
            return this.getColumn(item);
        });
    }

    // Listen sort change event
    sortChangeListener() {
        this.sort.sortChange.subscribe(() => {
            this.setParams({'ordering': (this.sort.direction == 'asc' ? '' : '-') + this.sort.active, 'page': 1});
        });
    }

    // Listen sort change event
    pageChangeListener() {
        this.paginator.page.subscribe((ev) => {
            let pageIndex = ev.pageIndex + 1;

            if(pageIndex == 1) {
                pageIndex = undefined;
            }
            this.setParams({'page_size': ev.pageSize, 'page': pageIndex});
        });

    }

    // Listen params change event
    paramsChangeListener() {
        this.activatedRoute.queryParams.subscribe(params => {

            let originalParams = this.params;
            this.params = params;
            params = Object.assign({}, params);
            // this.searchInput.value = params['search'] || '';
            this.paginator.pageIndex = parseInt(params['page'] || '1') - 1;
            this.paginator.pageSize = parseInt(params['page_size'] || this.defaultPageIndex);
            if(params['ordering'] && this.firstLoad) {
                let direction: 'asc' | 'desc' = 'asc';
                if(params['ordering'][0] == '-') {
                    direction = 'desc';
                    params['ordering'] = params['ordering'].slice(1);
                }
                // this.sort.direction = direction;
                this.firstLoad = false;
                // TODO:
                // this.sort.sort({id: params['ordering'], direction: direction, start: direction});
                this.sort.sort({id: params['ordering'], start: direction, disableClear: true});
            }
            // TODO:
            // this.searchInput.value = params['search'] || '';
            // this.changeDetectorRefs.detectChanges();
            this.loadItems(); // Print the parameter to the console.
        });
    }

    // Set router parameter
    setParam(key, value) {
        let data = {};
        if(value === '') {
            value = undefined;
        }
        data[key] = value;
        this.setParams(data);
    }

    setParams(newParams) {
        let params = Object.assign({}, this.params);
        params = Object.assign(params, newParams);
        if(params['page_size'] && params['page_size'] == this.defaultPageIndex) {
            params['page_size'] = undefined;
        }
        this.router.navigate([this.getRouterPage()], {queryParams: params});
    }

    setSearch(term) {
        this.setParam('search', term);
    }

    getRouterPage() {
        return this.routerPage;
    }

    // Retrieve from server items and set it
    loadItems() {
        let params = Object.assign({}, this.params);
        let queryset = this.queryset;
        if(params['ordering']){
            queryset = queryset.orderBy(params['ordering']);
            params['ordering'] = undefined;
        }
        if(params['search']){
            queryset = queryset.search(params['search']);
            params['search'] = undefined;
        }
        queryset = queryset.page(params['page'] || 1, params['page_size']);
        queryset.all().subscribe((items) => {
            this.items = items;
            this.itemsLength = items.count;
        });
    }

    getColumn(item) {
        if(isString(item)) {
            return item;
        }
        return item['column'];
    }

    getLabel(name) {
        if(!isString(name) && name['label']) {
            return name['label'];
        }
        if(!this.options) {
            return
        }
        name = this.getColumn(name);
        return this.queryset.getLabel(name);
    }

    getValue(row, name) {
        name = this.getColumn(name);
        return row.getValue(name);
    }

    onRowClick(row) {
        if(this.rowClick) {
            this.rowClick.emit(row);
        }
    }
}
