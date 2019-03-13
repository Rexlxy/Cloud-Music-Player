import { TestBed, inject } from '@angular/core/testing';

import { PlayListService } from './play-list.service';

describe('PlayListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayListService]
    });
  });

  it('should be created', inject([PlayListService], (service: PlayListService) => {
    expect(service).toBeTruthy();
  }));
});
