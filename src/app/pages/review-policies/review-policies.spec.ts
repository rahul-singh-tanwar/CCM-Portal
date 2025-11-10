import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPolicies } from './review-policies';

describe('ReviewPolicies', () => {
  let component: ReviewPolicies;
  let fixture: ComponentFixture<ReviewPolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewPolicies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewPolicies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
