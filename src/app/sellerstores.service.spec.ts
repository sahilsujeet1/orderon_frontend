import { TestBed } from '@angular/core/testing';

import { SellerstoresService } from './sellerstores.service';

describe('SellerstoresService', () => {
  let service: SellerstoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerstoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
