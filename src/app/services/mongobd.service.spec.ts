import { TestBed } from '@angular/core/testing';

import { MongobdService } from './mongobd.service';

describe('MongobdService', () => {
  let service: MongobdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MongobdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
