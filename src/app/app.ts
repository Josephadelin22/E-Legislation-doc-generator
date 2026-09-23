import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Composants de structure (Layout)
import { HeaderComponent } from './layout/components/header/header.component';
import { StepperComponent } from './layout/components/stepper/stepper.component';

// Modules fonctionnels (Features)
import { TemplateSelectionComponent } from './features/template-selection/template-selection.component';
import { LiveEditorComponent } from './features/live-editor/live-editor.component';
import { DocumentExportComponent } from './features/document-export/document-export.component';

// Service & Modèle de workflow
import { WorkflowStateService } from './core/services/workflow-state.services';
import { WorkFlowStep } from './core/models/workflow-state.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    StepperComponent,
    TemplateSelectionComponent,
    LiveEditorComponent,
    DocumentExportComponent
  ],
  template: `
    <div class="app-layout">
      <app-header></app-header>
      <app-stepper></app-stepper>

      <main class="app-content">
        @switch (currentStep()) {
          @case (WorkflowStep.TEMPLATE_SELECTION) {
            <app-template-selection></app-template-selection>
          }
          @case (WorkflowStep.LIVE_EDITOR) {
            <app-live-editor></app-live-editor>
          }
          @case (WorkflowStep.DOCUMENT_EXPORT) {
            <app-document-export></app-document-export>
          }
        }
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      background-color: #f8fafc;
      display: flex;
      flex-direction: column;
    }

    .app-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* --- Masquer le header et le stepper à l'impression --- */
    @media print {
      app-header,
      app-stepper {
        display: none !important;
      }

      .app-layout,
      .app-content {
        background-color: transparent !important;
        min-height: auto !important;
        display: block !important;
      }
    }
  `]
})
export class App {
  private readonly workflowService = inject(WorkflowStateService);

  readonly currentStep: Signal<WorkFlowStep> = this.workflowService.currentStep;
  readonly WorkflowStep = WorkFlowStep;
}