import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RepetitionsSelectorComponent} from './repetitions-selector.component';

describe('RepetitionsSelectorComponent', () => {
  let component: RepetitionsSelectorComponent;
  let fixture: ComponentFixture<RepetitionsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepetitionsSelectorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RepetitionsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
