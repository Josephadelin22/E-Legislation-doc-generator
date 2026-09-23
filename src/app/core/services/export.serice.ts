import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DocumentData } from '../models/document-data.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Simule ou déclenche l'exportation du document en format DOCX.
   */
  exportToDocx(document: DocumentData, filename?: string): Observable<boolean> {
    const defaultFilename = `${document.identification.typeActe}_${document.identification.numero || 'PROJET'}.docx`;
    const targetName = filename || defaultFilename;

    // Simulation de génération côté client (Blob texte pour le prototype autonome)
    const content = this.generateTextSnapshot(document);
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    this.triggerDownload(blob, targetName);

    return of(true).pipe(delay(500));
  }

  /**
   * Simule ou déclenche l'exportation du document en format PDF.
   */
  exportToPdf(document: DocumentData, filename?: string): Observable<boolean> {
    const defaultFilename = `${document.identification.typeActe}_${document.identification.numero || 'PROJET'}.pdf`;
    const targetName = filename || defaultFilename;

    const content = this.generateTextSnapshot(document);
    const blob = new Blob([content], { type: 'application/pdf' });
    this.triggerDownload(blob, targetName);

    return of(true).pipe(delay(500));
  }

  /**
   * Lance directement l'impression navigateur (utile pour prévisualiser la mise en page A4).
   */
  printDocument(): void {
    window.print();
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private generateTextSnapshot(doc: DocumentData): string {
    const visas = doc.visas?.map(v => v.texte).join('\n') ?? '';
    const articles = doc.articles
      .map(a => `Article ${a.numero} : ${a.titre ? a.titre + ' - ' : ''}\n${a.contenu}`)
      .join('\n\n');

    return `
${doc.enTete.republique}
${doc.enTete.devise}
${doc.enTete.ministere || ''}

${doc.identification.typeActe} N° ${doc.identification.numero}/${doc.identification.annee || ''}
${doc.identification.objet}

${doc.autorite}

${visas}

${doc.formulePivot}

${articles}

Fait à ${doc.cloture.faitA}, le ${doc.cloture.dateSignature || ''}
${doc.cloture.signatairePrincipal.titre}
    `.trim();
  }
}