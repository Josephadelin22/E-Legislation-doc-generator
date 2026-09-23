import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TemplateDefintion, CategorieActe } from '../models/template-definition.model';
import { DocumentData } from '../models/document-data.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateRegistryService {

  private readonly templates: TemplateDefintion[] = [
    {
      id: 'tpl-arrete-ministeriel',
      code: 'ARR-MIN',
      title: 'Arrêté ministériel réglementaire',
      category: 'Arrete',
      type: 'arrete',
      description: 'Gabarit officiel pour décision ministérielle avec visas légistiques, formules pivots et articles extensibles.',
      authority: 'Ministères & SGG',
      version: 'v2.4',
      format: 'DOCX',
      isFrequent: true,
      formSchema: {
        id: 'schema-arrete',
        title: 'Formulaire de rédaction - Arrêté',
        sections: [
          {
            id: 'sec-entete',
            title: '1. Timbre & En-tête officiel',
            description: 'Identification du ministère et références de l’acte',
            fields: [
              {
                key: 'ministere',
                label: 'Ministère émetteur (Timbre)',
                type: 'text',
                required: true,
                placeholder: 'ex: MINISTÈRE DE L’ÉCONOMIE ET DES PARTICIPATIONS'
              },
              {
                key: 'sigleMinistere',
                label: 'Sigle administratif',
                type: 'text',
                required: true,
                placeholder: 'ex: MEP'
              },
              {
                key: 'direction',
                label: 'Direction générale ou service',
                type: 'text',
                placeholder: 'ex: Direction Générale du Commerce'
              },
              {
                key: 'numero',
                label: 'Numéro d’enregistrement',
                type: 'text',
                required: true,
                placeholder: 'ex: 0073'
              },
              {
                key: 'annee',
                label: 'Année de promulgation',
                type: 'text',
                required: true,
                placeholder: 'ex: 2026'
              },
              {
                key: 'objet',
                label: 'Objet de l’acte',
                type: 'textearea',
                required: true,
                rows: 3,
                placeholder: 'portant fixation ou réglementation de...'
              }
            ]
          },
          {
            id: 'sec-autorite-visas',
            title: '2. Autorité & Visas juridiques',
            description: 'Base légale et constitutionnelle de la décision',
            fields: [
              {
                key: 'autorite',
                label: 'Titre de l’autorité signataire',
                type: 'text',
                required: true,
                placeholder: 'ex: Le Ministre de l’Économie et des Participations ;'
              },
              {
                key: 'visas',
                label: 'Visas juridiques',
                type: 'repeater',
                required: true,
                repeaterConfig: {
                  itemLabel: 'Visa',
                  addLabel: '+ Ajouter un visa',
                  emptySatetText: 'Aucun visa légal ajouté. Ajoutez les textes fondateurs.',
                  fields: [
                    {
                      key: 'texte',
                      label: 'Texte du visa',
                      type: 'textearea',
                      rows: 2,
                      required: true,
                      placeholder: 'ex: Vu la loi n°... du...'
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'sec-dispositif',
            title: '3. Dispositif réglementaire (Articles)',
            description: 'Corps exécutoire du texte juridique',
            fields: [
              {
                key: 'articles',
                label: 'Articles du dispositif',
                type: 'repeater',
                required: true,
                repeaterConfig: {
                  itemLabel: 'Article',
                  addLabel: '+ Ajouter un article',
                  emptySatetText: 'Aucun article rédigé.',
                  fields: [
                    {
                      key: 'titre',
                      label: 'Titre / Objet de l’article (optionnel)',
                      type: 'text',
                      placeholder: 'ex: Champ d’application'
                    },
                    {
                      key: 'contenu',
                      label: 'Contenu de l’article',
                      type: 'textearea',
                      rows: 4,
                      required: true,
                      placeholder: 'Saisissez les dispositions légales de cet article...'
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'sec-cloture',
            title: '4. Fait et Signature',
            description: 'Lieu, date et signataire officiel',
            fields: [
              {
                key: 'faitA',
                label: 'Fait à',
                type: 'text',
                required: true,
                placeholder: 'ex: Libreville'
              },
              {
                key: 'dateSignature',
                label: 'Date de signature',
                type: 'date',
                required: true
              },
              {
                key: 'signataireTitre',
                label: 'Qualité du signataire',
                type: 'text',
                required: true,
                placeholder: 'ex: Le Ministre de l’Économie et des Participations'
              },
              {
                key: 'signataireNom',
                label: 'Nom du signataire (optionnel)',
                type: 'text',
                placeholder: 'ex: Prénom NOM'
              }
            ]
          }
        ]
      },
      createEmptyData: (): DocumentData => ({
        typeActe: 'ARRÊTÉ',
        enTete: {
          republique: 'RÉPUBLIQUE GABONAISE',
          devise: 'Union - Travail - Justice',
          ministere: '',
          sigleMinistere: '',
          direction: '',
          visaControle: 'Visa C.I.'
        },
        identification: {
          typeActe: 'ARRÊTÉ',
          numero: '',
          annee: '2026',
          objet: ''
        },
        autorite: '',
        formulePivot: 'ARRÊTE :',
        visas: [
          { id: crypto.randomUUID(), ordre: 1, texte: 'Vu la Constitution ;' }
        ],
        articles: [
          { id: crypto.randomUUID(), numero: '1', titre: '', contenu: '' }
        ],
        cloture: {
          faitA: 'Libreville',
          dateSignature: new Date().toISOString().split('T')[0],
          signatairePrincipal: {
            titre: '',
            nom: ''
          }
        }
      })
    },
    {
      id: 'tpl-decret-application',
      code: 'DEC-APP',
      title: 'Décret d’application simple',
      category: 'Decret',
      type: 'decret',
      description: 'Modèle de décret d’application pour mesure législative, visas conformes au Secrétariat Général du Gouvernement.',
      authority: 'Présidence / SGG',
      version: 'v2.1',
      format: 'DOCX',
      isFrequent: true,
      formSchema: {
        id: 'schema-decret',
        title: 'Formulaire de rédaction - Décret',
        sections: [
          {
            id: 'sec-entete-decret',
            title: '1. Identification du Décret',
            fields: [
              {
                key: 'numero',
                label: 'Numéro du décret',
                type: 'text',
                required: true,
                placeholder: 'ex: 0142/PR'
              },
              {
                key: 'annee',
                label: 'Année légale',
                type: 'text',
                required: true,
                placeholder: 'ex: 2026'
              },
              {
                key: 'objet',
                label: 'Objet du décret',
                  type: 'textearea',
                required: true,
                rows: 3,
                placeholder: 'portant application de la loi n°...'
              }
            ]
          },
          {
            id: 'sec-visas-decret',
            title: '2. Visas & Délibération',
            fields: [
              {
                key: 'visas',
                label: 'Visas constitutionnels et délibérations',
                type: 'repeater',
                required: true,
                repeaterConfig: {
                  itemLabel: 'Visa',
                  addLabel: '+ Ajouter un visa',
                  fields: [
                    {
                      key: 'texte',
                      label: 'Texte du visa',
                      type: 'textearea',
                      rows: 2,
                      required: true,
                      placeholder: 'ex: Le Conseil d’État consulté ;'
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'sec-dispositif-decret',
            title: '3. Dispositif (Articles)',
            fields: [
              {
                key: 'articles',
                label: 'Articles du décret',
                type: 'repeater',
                required: true,
                repeaterConfig: {
                  itemLabel: 'Article',
                  addLabel: '+ Ajouter un article',
                  fields: [
                    {
                      key: 'titre',
                      label: 'Titre de l’article (optionnel)',
                      type: 'text'
                    },
                    {
                      key: 'contenu',
                      label: 'Corps de l’article',
                      type: 'textearea',
                      rows: 4,
                      required: true
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 'sec-cloture-decret',
            title: '4. Signatures & Contreseings',
            fields: [
              {
                key: 'faitA',
                label: 'Fait à',
                type: 'text',
                required: true,
                placeholder: 'ex: Libreville'
              },
              {
                key: 'dateSignature',
                label: 'Date de signature',
                  type: 'textearea',
                required: true
              },
              {
                key: 'signataireTitre',
                label: 'Autorité principale',
                type: 'text',
                required: true,
                placeholder: 'ex: Le Président de la République, Chef de l’État'
              }
            ]
          }
        ]
      },
      createEmptyData: (): DocumentData => ({
        typeActe: 'DÉCRET',
        enTete: {
          republique: 'RÉPUBLIQUE GABONAISE',
          devise: 'Union - Travail - Justice',
          ministere: 'PRÉSIDENCE DE LA RÉPUBLIQUE',
          sigleMinistere: 'PR'
        },
        identification: {
          typeActe: 'DÉCRET',
          numero: '',
          annee: '2026',
          objet: ''
        },
        autorite: 'Le Président de la République, Chef de l’État ;',
        formulePivot: 'DÉCRÈTE :',
        visas: [
          { id: crypto.randomUUID(), ordre: 1, texte: 'Vu la Constitution ;' },
          { id: crypto.randomUUID(), ordre: 2, texte: 'Le Conseil des Ministres entendu ;' }
        ],
        articles: [
          { id: crypto.randomUUID(), numero: '1', titre: '', contenu: '' }
        ],
        cloture: {
          faitA: 'Libreville',
          dateSignature: new Date().toISOString().split('T')[0],
          signatairePrincipal: {
            titre: 'Le Président de la République, Chef de l’État',
            nom: ''
          }
        }
      })
    }
  ];

  getTemplates(): Observable<TemplateDefintion[]> {
    return of(this.templates).pipe(delay(150));
  }

  getTemplateById(id: string): Observable<TemplateDefintion | undefined> {
    const template = this.templates.find(t => t.id === id);
    return of(template).pipe(delay(100));
  }

  getTemplatesByCategory(category: CategorieActe): Observable<TemplateDefintion[]> {
    return of(this.templates.filter(t => t.category === category)).pipe(delay(100));
  }

  searchTemplates(query: string, category?: string): Observable<TemplateDefintion[]> {
    return of(this.templates).pipe(
      delay(150),
      map(items => items.filter(t => {
        const matchesQuery = query.trim() === '' ||
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.code.toLowerCase().includes(query.toLowerCase());

        const matchesCategory = !category || category === 'Tous' || t.category === category;

        return matchesQuery && matchesCategory;
      }))
    );
  }
}