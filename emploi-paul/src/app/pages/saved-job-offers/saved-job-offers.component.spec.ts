import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedJobOffersComponent } from './saved-job-offers.component';

describe('SavedJobOffersComponent', () => {
  let component: SavedJobOffersComponent;
  let fixture: ComponentFixture<SavedJobOffersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedJobOffersComponent]
    });
    fixture = TestBed.createComponent(SavedJobOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
