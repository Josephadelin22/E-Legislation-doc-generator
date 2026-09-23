import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStateService } from '../../../core/services/workflow-state.services';
import { WorkFlowStep } from '../../../core/models/workflow-state.model';


export interface EtapeItem {
  numero: WorkFlowStep;
  titre: string;
  description: string;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent {
  private readonly workflowService = inject(WorkflowStateService);

  readonly currentStep = this.workflowService.currentStep;

  readonly etapes: EtapeItem[] = [
    { numero: WorkFlowStep.TEMPLATE_SELECTION, titre: 'Modèle', description: 'Catalogue SGG' },
    { numero: WorkFlowStep.LIVE_EDITOR, titre: 'Édition Live', description: 'Questionnaire & Aperçu' },
    { numero: WorkFlowStep.DOCUMENT_EXPORT, titre: 'Export', description: 'Génération officielle' }
  ];

  onStepClick(step: WorkFlowStep): void {
    if (step < this.currentStep()) {
      this.workflowService.goToStep(step);
    }
  }
}