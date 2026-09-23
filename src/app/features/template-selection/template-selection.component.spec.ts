import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateSelectionComponent } from './template-selection.component';

describe('TemplateSelectionComponent', () => {
  let component: TemplateSelectionComponent;
  let fixture: ComponentFixture<TemplateSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateSelectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
