# @angular/django

angular2-django is **Django Rest Framework API** for Angular 5+. Use the Django API in an easy way and as objects.

## Usage
Some examples of the API.


### List items from API

```typescript

export class SnippetListComponent implements OnInit {
        snippets: Snippet[];
    
        constructor(
            private api: SnippetApi,
        )
        
        ngOnInit() {
            // Get first page from API filtered by language = Python and ordered
            // by -created.
            this.api.orderBy('-created').filter({'language': 'python'})
                    .page(1).all().subscribe((snippets: Snippet[]) => {
                this.snippets = snippets;
            });
        }
}
``` 

### Get and item and edit it.

```typescript

export class SnippetEditComponent implements OnInit {
        snippet: Snippet;
        highlightedCode: string;
        localDateTime: string;
        ownerFullName: string;
    
        constructor(
            private api: SnippetApi,
        )
        
        ngOnInit() {
            // Get first page from API filtered by language = Python and ordered
            // by -created.
            this.api.get(12).subscribe((snippet: Snippet) => {
                // Execute a method on Snippet
                this.highlightedCode = snippet.getHighlightedCode();
                // Execute a method on User serializer
                this.ownerFullName = snippet.owner.getFullName();
                // created is converted to Date
                this.localDateTime = snippet.created.toLocaleDateString();
                // Change snippet title (unsaved)
                snippet.title = 'New snippet title'
                // Save changes
                snippet.save().subscribe();
            });
        }
}
``` 


### Serializer and API


```typescript
export class Snippet extends SerializerService {

    @Field() title: string;
    @Field() owner: User;  // User is also a serializer
    @Field() created: Date;
    @Field() code: string;
    @Field() language: string;
    
    getHighlightedCode() {
        // Method on Serializer
        return '...'
    }
}


@Injectable({
  providedIn: 'root'
})
export class SnippetApi extends ApiService {

    url = '/api/snippets/';
    serializer = Snippet;

    constructor(http: HttpClient) {
        super(http);
    }
}
```


## Installation

To install this library, run:

```bash
$ npm install @angular/django --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install @angular/django
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { SampleModule } from '@angular/django';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    LibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<sampleComponent></sampleComponent>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [nekmo](mailto:contacto@nekmo.com)
