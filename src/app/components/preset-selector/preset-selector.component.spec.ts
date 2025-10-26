import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PresetSelectorComponent} from './preset-selector.component';

describe('PresetSelectorComponent', () => {
  let component: PresetSelectorComponent;
  let fixture: ComponentFixture<PresetSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresetSelectorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PresetSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
