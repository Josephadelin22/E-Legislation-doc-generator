import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveEditorComponent } from './live-editor.component';

describe('LiveEditorComponent', () => {
  let component: LiveEditorComponent;
  let fixture: ComponentFixture<LiveEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveEditorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
