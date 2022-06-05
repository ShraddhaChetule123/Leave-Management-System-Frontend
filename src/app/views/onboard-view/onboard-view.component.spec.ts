import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardViewComponent } from './onboard-view.component';

describe('OnboardViewComponent', () => {
  let component: OnboardViewComponent;
  let fixture: ComponentFixture<OnboardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
