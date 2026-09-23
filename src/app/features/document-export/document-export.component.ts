import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkflowStateService } from '@/core/services/workflow-state.services';
import { WorkFlowStep, TransmissionMetadata } from '@/core/models/workflow-state.model';

@Component({
  selector: 'app-document-export',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-export.component.html',
  styleUrl: './document-export.component.css'
})
export class DocumentExportComponent {
  private readonly workflowService = inject(WorkflowStateService);

  readonly template = this.workflowService.selectedTemplate;
  readonly doc = this.workflowService.documentData;
  readonly statut = this.workflowService.statutActe;
  readonly estVerrouille = this.workflowService.estVerrouille;
  readonly notification = signal<string | null>(null);

  readonly modalTransmissionOuverte = signal<boolean>(false);
  donneesTransmission: TransmissionMetadata = {
    dossierNumero: `DOS-SGG-${new Date().getFullYear()}-001`,
    destinataireSgg: 'Direction du Contrôle Légistique (SGG)',
    priorite: 'NORMALE',
    observations: ''
  };

  retourEditeur(): void {
    if (this.estVerrouille()) {
      alert('Ce document est finalisé et verrouillé. Toute modification directe est désactivée conformément aux règles du SGG.');
      return;
    }
    this.workflowService.goToStep(WorkFlowStep.LIVE_EDITOR);
  }

  validerEtFinaliser(): void {
    const confirmation = confirm(
      'Confirmez-vous la finalisation de cet acte ?\n\n' +
      'Une fois validé, son contenu sera scellé et ne pourra plus être modifié directement.'
    );

    if (!confirmation) return;

    this.workflowService.finaliserActe('Direction Légistique');
    this.afficherNotification('Document validé et marqué comme FINALISÉ.');
  }

  imprimerOuPDF(): void {
    window.print();
  }

  ouvrirModalTransmission(): void {
    this.modalTransmissionOuverte.set(true);
  }

  fermerModalTransmission(): void {
    this.modalTransmissionOuverte.set(false);
  }

  async executerTransmission(): Promise<void> {
    const succes = await this.workflowService.transmettreAuSGG(this.donneesTransmission);
    if (succes) {
      this.fermerModalTransmission();
      this.afficherNotification('Document transmis au SGG avec succès.');
    }
  }

  exporterWord(): void {
    const data = this.doc();
    if (!data) return;

    const visasHtml = (data.visas || [])
      .map(v => `<p style="margin: 0 0 4pt 0; text-align: justify; text-indent: 1.25cm;">${v.texte}</p>`)
      .join('');

    const articlesHtml = (data.articles || [])
      .map(a => `
        <div style="margin-bottom: 12pt; text-align: justify;">
          <p style="margin: 0 0 2pt 0;">
            <strong>Article ${a.numero} :</strong> ${a.titre ? '<em>(' + a.titre + ')</em>' : ''}
          </p>
          <p style="margin: 0; text-indent: 1.25cm;">${a.contenu}</p>
        </div>
      `).join('');

    const contenuWord = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${data.identification.typeActe} N° ${data.identification.numero || ''}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: 210mm 297mm;
            margin: 25mm 20mm 25mm 20mm;
          }
          div.Section1 { page: Section1; }
          body {
            font-family: 'Times New Roman', 'Liberation Serif', Times, serif;
            font-size: 11pt;
            line-height: 1.35;
            color: #000000;
          }
          table {
            border: 0 !important;
            border-collapse: collapse !important;
          }
          td {
            border: 0 !important;
            padding: 0 !important;
          }
          table.entete { width: 100%; border: none; margin-bottom: 24pt; }
          td.timbre { width: 55%; vertical-align: top; font-size: 9.5pt; line-height: 1.2; border: none; }
          td.devise { width: 45%; vertical-align: top; text-align: center; font-size: 9.5pt; line-height: 1.2; border: none; }
          .titre { text-align: center; font-size: 13pt; font-weight: bold; margin: 16pt 0 6pt 0; text-transform: uppercase; }
          .objet { text-align: center; font-size: 11pt; font-weight: bold; margin: 0 auto 16pt auto; width: 85%; }
          .pivot { text-align: center; font-weight: bold; letter-spacing: 2pt; margin: 16pt 0; }
        </style>
      </head>
      <body>
        <div class="Section1">
          <table class="entete" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="timbre" width="55%" valign="top">
                <strong>${(data.enTete.ministere || '').toUpperCase()}</strong><br>
                ${data.enTete.sigleMinistere ? data.enTete.sigleMinistere + '<br>' : ''}
                ${data.enTete.direction ? '<em>' + data.enTete.direction + '</em><br>' : ''}
                ---------<br>
                <strong>N° ${data.identification.numero || '_____'}/${data.enTete.sigleMinistere || 'SG'}</strong>
              </td>
              <td class="devise" width="45%" valign="top">
                <strong>RÉPUBLIQUE GABONAISE</strong><br>
                <em>Union - Travail - Justice</em><br>
                ---------
              </td>
            </tr>
          </table>

          <div class="titre">
            ${data.identification.typeActe} N° ${data.identification.numero || '____'} / ${data.identification.annee || ''}
          </div>
          <div class="objet">${data.identification.objet || ''}</div>

          ${data.autorite ? `<p style="margin-bottom: 10pt;">${data.autorite}</p>` : ''}
          <div style="margin-bottom: 14pt;">${visasHtml}</div>
          <div class="pivot">${data.formulePivot || 'ARRÊTE :'}</div>
          <div>${articlesHtml}</div>

          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100%; border: none; margin-top: 30pt;">
            <tr>
              <td width="50%" style="width: 50%; border: none;">&nbsp;</td>
              <td width="50%" align="right" style="width: 50%; text-align: right; border: none;">
                <p style="margin: 0 0 10pt 0; text-align: right;">
                  Fait à ${data.cloture.faitA || 'Libreville'}, le ${data.cloture.dateSignature || '________'}
                </p>
                <p style="margin: 0 0 45pt 0; font-weight: bold; text-align: right;">
                  ${data.cloture.signatairePrincipal.titre || ''}
                </p>
                <p style="margin: 0; font-weight: bold; text-align: right;">
                  ${data.cloture.signatairePrincipal.nom || ''}
                </p>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + contenuWord], {
      type: 'application/msword;charset=utf-8'
    });

    const nomFichier = `${data.identification.typeActe}_${data.identification.numero || 'acte'}.doc`;
    this.telechargerFichier(blob, nomFichier);
    this.afficherNotification('Document Word (.doc) téléchargé.');
  }

  private telechargerFichier(blob: Blob, nomFichier: string): void {
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = nomFichier.replace(/\s+/g, '_');
    element.click();
    URL.revokeObjectURL(url);
  }

  private afficherNotification(message: string): void {
    this.notification.set(message);
    setTimeout(() => this.notification.set(null), 3500);
  }
}