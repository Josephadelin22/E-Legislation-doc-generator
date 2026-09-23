import { Injectable, signal, computed } from '@angular/core';
import { WorkFlowState, WorkFlowStep, INITIAL_WORKFLOW_STATE, StatutActe, TransmissionMetadata } from '../models/workflow-state.model';
import { TemplateDefintion } from '../models/template-definition.model';
import { DocumentData } from '../models/document-data.model';
// Clé utilisée par le navigateur pour stocker le brouillon courant.
const Brouillon = 'e_legislation brouillon';

@Injectable({
  providedIn: 'root'
})
export class WorkflowStateService {
  /**
   * Source unique de vérité pour l'état du parcours de création d'un acte.
   *
   * Le signal reste privé afin d'empêcher les composants de modifier
   * directement l'état. Les changements passent par les méthodes du service,
   * ce qui permet de conserver les règles métier au même endroit.
   */
  private readonly _state = signal<WorkFlowState>(INITIAL_WORKFLOW_STATE);

  // Vues en lecture seule de l'état, consommables par les composants Angular.
  // Un composant peut donc réagir automatiquement aux changements sans
  // pouvoir remplacer l'état interne du service.
  readonly state = this._state.asReadonly();
  readonly currentStep = computed(() => this._state().currentStep);
  readonly selectedTemplate = computed(() => this._state().selectedTemplate);
  readonly documentData = computed(() => this._state().documentData);
  readonly isValid = computed(() => this._state().isValid);

  // État métier de l'acte, distinct de l'étape d'affichage du workflow.
  // Par exemple, un acte peut être affiché dans l'éditeur tout en étant déjà
  // finalisé ou transmis.
  readonly statutActe = signal<StatutActe>(StatutActe.BROUILLON);

  // Un acte finalisé ou transmis ne doit plus être considéré comme modifiable.
  readonly estVerrouille = computed(() => this.statutActe() === StatutActe.FINALISE || this.statutActe() === StatutActe.TRANSMIS);

  // Métadonnées conservées après une transmission réussie au SGG.
  readonly transmissionData = signal<TransmissionMetadata | null>(null);
  
  // Indicateur réactif utilisé par l'interface pour proposer la restauration
  // d'un brouillon déjà présent dans le stockage local du navigateur.
  readonly BrouillonSauvegarde = signal<boolean>(this.verifiedBrouillonExistant());
   
  /**
   * Vérifie côté navigateur si un brouillon est enregistré.
   *
   * Le test sur `window` rend la méthode compatible avec un environnement
   * sans DOM, par exemple lors d'un rendu serveur ou de certains tests.
   */
  verifiedBrouillonExistant(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem(Brouillon);
  }

  /**
   * Sélectionne un modèle dans le catalogue et bascule vers l'éditeur Live.
   */
  selectTemplate(template: TemplateDefintion): void {
    // Chaque modèle fournit une structure initiale adaptée à son type d'acte.
    const emptyDocument = template.createEmptyData();

    // La sélection d'un modèle démarre une nouvelle session d'édition.
    // Le document est donc réinitialisé et repasse à l'étape de validation
    // initiale, même si un autre modèle avait été utilisé auparavant.
    this._state.update(state => ({
      ...state,
      selectedTemplate: template,
      documentData: emptyDocument,
      currentStep: WorkFlowStep.LIVE_EDITOR,
      isValid: false,
      lastSavedAt: new Date()
    }));
  }

  /**
   * Met à jour les données et sauvegarde automatiquement le brouillon en local.
   */
  updateDocumentData(data: DocumentData): void {
    // On crée une nouvelle référence afin que les signaux et les composants
    // détectent correctement la modification du document.
    this._state.update(state => ({
      ...state,
      documentData: { ...data },
      lastSavedAt: new Date()
    }));

    // La sauvegarde est déclenchée après la mise à jour de l'état pour que le
    // brouillon persistant corresponde exactement aux données courantes.
    this.sauvegarderBrouillon();
  }

  goToStep(step: WorkFlowStep): void {
    // Cette méthode est le point d'entrée unique pour changer l'étape visible
    // dans le parcours (sélection, édition ou export).
    this._state.update(state => ({
      ...state,
      currentStep: step
    }));
  }

  setValidationStatus(isValid: boolean): void {
    // Le statut est fourni par l'éditeur ou le formulaire. Il est conservé
    // dans l'état afin que les autres étapes puissent décider si l'acte peut
    // être finalisé ou exporté.
    this._state.update(state => ({
      ...state,
      isValid
    }));
  }

  resetWorkflow(): void {
    // Réinitialise uniquement l'état du workflow en mémoire. Le brouillon
    // local n'est pas supprimé ici : cette opération est volontairement
    // distincte de `supprimerBrouillon()`.
    this._state.set(INITIAL_WORKFLOW_STATE);
  }

  // --- Gestion du Brouillon (EF-2.5) ---

  sauvegarderBrouillon(): void {
    const currentState = this._state();

    // Il est impossible de restaurer une session utile sans modèle ni données
    // de document. On évite donc d'écrire un brouillon incomplet.
    if (!currentState.documentData || !currentState.selectedTemplate) return;

    // Le snapshot contient tout ce qui est nécessaire pour reconstruire
    // l'écran d'édition lors d'une prochaine ouverture de l'application.
    const snapshot = {
      template: currentState.selectedTemplate,
      documentData: currentState.documentData,
      dataSauvegarde: new Date().toISOString()
    };

    // localStorage ne conserve que du texte : l'objet doit être sérialisé
    // avant d'être enregistré.
    localStorage.setItem(Brouillon, JSON.stringify(snapshot));
    this.BrouillonSauvegarde.set(true);
  }

  restaurerBrouillon(): boolean {
    // Une absence de donnée n'est pas une erreur : elle signifie simplement
    // qu'il n'y a aucun brouillon à restaurer.
    const raw = localStorage.getItem(Brouillon);
    if (!raw) return false;

    try {
      // JSON.parse peut échouer si la donnée a été supprimée ou modifiée entre
      // deux sessions. Le try/catch permet de garder l'application utilisable.
      const { template, documentData, dataSauvegarde } = JSON.parse(raw);

      // La restauration replace l'utilisateur directement dans l'éditeur.
      // Le document restauré doit être revalidé, car son contenu peut être
      // devenu obsolète depuis sa dernière sauvegarde.
      this._state.set({
        currentStep: WorkFlowStep.LIVE_EDITOR,
        selectedTemplate: template,
        documentData: documentData,
        isValid: false,
        lastSavedAt: new Date(dataSauvegarde)
      });

      return true;
    } catch (e) {
      console.error('Erreur lors de la restauration du brouillon', e);
      return false;
    }
  }

  supprimerBrouillon(): void {
    
    localStorage.removeItem(Brouillon);
    this.BrouillonSauvegarde.set(false);
  }

  finaliserActe(redacteur: string): void {
    // La finalisation verrouille l'acte au niveau métier et rend le document
    // valide pour les étapes suivantes. Le paramètre `redacteur` est conservé
    // dans la signature pour permettre d'enregistrer l'auteur ultérieurement.
    this.statutActe.set(StatutActe.FINALISE);
    this._state.update(state => ({

      ...state,
      isValid: true,
      lastSavedAt: new Date
    }));

    this.supprimerBrouillon();
  }

  /**
   * Simule l'envoi de l'acte vers le SGG.
   *
   * La méthode retourne `false` si le document ou le modèle manque, puis
   * construit une copie enrichie des métadonnées avant de la transmettre.
   * Dans la version actuelle, l'appel réseau est remplacé par un `console.log`.
   * Le booléen de retour permet néanmoins au composant appelant de distinguer
   * une transmission acceptée d'une transmission impossible ou en erreur.
   */
  async transmettreAuSGG(payload: TransmissionMetadata): Promise<boolean> {
    // Les données nécessaires sont lues depuis les signaux au moment de
    // l'envoi afin d'éviter de transmettre une ancienne version du document.
    const document = this.documentData();
    const template = this.selectedTemplate();

    // Sans document ou modèle sélectionné, aucun payload fiable ne peut être
    // construit. Le retour explicite évite l'erreur de fonction sans valeur.
    if(!document || !template) return false;

    // On complète les métadonnées reçues par les informations calculées par
    // l'application : date, statut et identification du modèle et de l'acte.
    const archivePayload = {
      metadata: {
        ...payload,
        transmisLe: new Date().toISOString(),
        statut: StatutActe.TRANSMIS,
        modeleId: template.id,
        typeActe: document.identification.typeActe,
        numeroActe: document.identification.numero 
      },

      donneesActe: document
    };

    try{
      // Dans une implémentation réelle, cet emplacement appellerait un
      // service HTTP. La simulation affiche le contenu exact envoyé au SGG.
      console.log('Payload transmis au serveur central SGG:', archivePayload);

      // La transmission n'est considérée comme réussie qu'après la fin de
      // l'appel simulé. On conserve alors les métadonnées et on verrouille
      // l'acte avec le statut TRANSMIS.
      this.transmissionData.set(archivePayload.metadata);
      this.statutActe.set(StatutActe.TRANSMIS);
      return true;
    } catch (error) {
      // Toute erreur du futur appel réseau sera convertie en false afin que
      // l'interface puisse afficher un échec sans interrompre l'application.
      console.error('Erreur API transmission SGG', error);
      return false;
    }
  }
}