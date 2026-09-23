import { TemplateDefintion } from "./template-definition.model";
import { DocumentData } from "./document-data.model";

export enum WorkFlowStep {
    TEMPLATE_SELECTION = 1,
    LIVE_EDITOR = 2,
    DOCUMENT_EXPORT = 3
}

export interface WorkFlowState{
    currentStep: WorkFlowStep;
    selectedTemplate: TemplateDefintion | null;
    documentData: DocumentData | null;
    isValid: boolean;
    lastSavedAt?: Date;
}

export const INITIAL_WORKFLOW_STATE: WorkFlowState = {
    currentStep:WorkFlowStep.TEMPLATE_SELECTION,
    selectedTemplate: null,
    documentData:null,
    isValid:false
}

export enum StatutActe{
    BROUILLON = 'BROUILLON',
    EN_VALIDATION = 'EN_VALIDATION',
    FINALISE = 'FINALISE',
    TRANSMIS = 'TRANSMIS'
}

export interface TransmissionMetadata {
    dossierNumero: string;
    destinataireSgg: string;
    priorite: 'NORMALE' | 'URGENTE' | 'TRES_URGENTE';
    observations?: string;
    transmisLe?: string;
    transmisPar?: string;
}

export interface ActeTraceabilite {
    status: StatutActe;
    verrouille: boolean;
    finaliseLe?: string;
    finalisePar?: string;
    transmission?: TransmissionMetadata;
}

