import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentExportComponent } from './document-export.component';

describe('DocumentExportComponent', () => {
  let component: DocumentExportComponent;
  let fixture: ComponentFixture<DocumentExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentExportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentExportComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
