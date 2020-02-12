import { TestBed, inject } from '@angular/core/testing';

import { BulkUpdateService } from './bulk-update.service';

describe('BulkUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BulkUpdateService]
    });
  });

  it('should be created', inject([BulkUpdateService], (service: BulkUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
