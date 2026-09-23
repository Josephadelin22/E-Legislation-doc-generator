import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowStateService } from '@/core/services/workflow-state.services';
import { WorkFlowStep } from '@/core/models/workflow-state.model';
import { VisaItem, ArticleItem } from '@/core/models/document-data.model';

@Component({
  selector: 'app-live-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-editor.component.html',
  styleUrl: './live-editor.component.css',
})
export class LiveEditorComponent {
  private readonly workflowService = inject(WorkflowStateService);

  readonly template = this.workflowService.selectedTemplate;
  readonly docData = this.workflowService.documentData;
  readonly messageSauvegarde = signal<string | null>(null);
  readonly newBrouillon = this.workflowService.BrouillonSauvegarde
  readonly afficherAlerteBrouillon = signal<boolean>(
   this.workflowService.verifiedBrouillonExistant()
);
  // Navigation du workflow
  retourAuCatalogue(): void {
    this.workflowService.goToStep(WorkFlowStep.TEMPLATE_SELECTION);
  }

  passerALExport(): void {
    this.workflowService.goToStep(WorkFlowStep.DOCUMENT_EXPORT);
  }

  // Alias au cas où l'ancien nom est encore présent dans ton template
  PasserAExport(): void {
    this.passerALExport();
  }

  // Synchronisation des données
  notifyChange(): void {
    const current = this.docData();
    if (current) {
      this.workflowService.updateDocumentData(current);
    }
  }

  // Gestion des Visas
  ajouterVisa(): void {
    const current = this.docData();
    if (!current) return;

    const nouveauVisa: VisaItem = {
      id: crypto.randomUUID(),
      ordre: (current.visas?.length ?? 0) + 1,
      texte: 'Vu '
    };

    current.visas?.push(nouveauVisa);
    this.notifyChange();
  }

  supprimerVisa(index: number): void {
    const current = this.docData();
    if (!current || (current.visas?.length ?? 0) <= 1) return;

    current.visas?.splice(index, 1);
    current.visas?.forEach((v, i) => (v.ordre = i + 1));
    this.notifyChange();
  }

  // Gestion des Articles
  ajouterArticle(): void {
    const current = this.docData();
    if (!current) return;

    const nouvelArticle: ArticleItem = {
      id: crypto.randomUUID(),
      numero: String((current.articles?.length ?? 0) + 1),
      titre: '',
      contenu: ''
    };

    current.articles?.push(nouvelArticle);
    this.notifyChange();
  }

  supprimerArticle(index: number): void {
    const current = this.docData();
    if (!current || (current.articles?.length ?? 0) <= 1) return;

    current.articles?.splice(index, 1);
    current.articles?.forEach((a, i) => (a.numero = String(i + 1)));
    this.notifyChange();
  }

  // Sauvegarde manuelle du brouillon
  sauvegarderManuel(): void {
    this.workflowService.sauvegarderBrouillon();
    this.messageSauvegarde.set('Brouillon conservé avec succès');
    setTimeout(() => this.messageSauvegarde.set(null), 2500);
  }

  // Alias pour éviter toute incohérence de nommage
  sauvegardeManuel(): void {
    this.sauvegarderManuel();
  }

  reprendreBrouillon(): void{
    const succes = this.workflowService.restaurerBrouillon();
    if(succes) {
      this.messageSauvegarde.set('Brouillon restaturé');
      setTimeout(() => this.messageSauvegarde.set(null), 2500);
    }
  }
  ignorerBrouillon(): void{
    this.afficherAlerteBrouillon.set(false);
  }

}