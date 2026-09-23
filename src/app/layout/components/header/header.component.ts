import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WorkflowStateService } from "@/core/services/workflow-state.services"
import { WorkFlowStep } from "@/core/models/workflow-state.model";


@Component({
    selector:'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'

})

export class HeaderComponent {
    private readonly workflowService = inject(WorkflowStateService);

    readonly currentStep = this.workflowService.currentStep
    readonly selectedTemplate = this.workflowService.selectedTemplate;
    readonly WorkFlowStep = WorkFlowStep;

    resetToCatalogue(): void{
        this.workflowService.goToStep(WorkFlowStep.TEMPLATE_SELECTION);
    }

}