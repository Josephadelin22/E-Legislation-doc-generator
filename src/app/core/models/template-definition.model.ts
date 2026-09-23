import { FormSchema } from "./form-schema.model";
import { DocumentData } from "./document-data.model";

export type TemplateType =  'arrete' | 'code' | 'decret' | 'Constitution'| 'expose-motifs'| 'fiche-technique' | 'loi-organique' | 'loi-ordinaire' | 'ordonnance';

export type CategorieActe = 'Arrete' | 'Decret' | 'Loi Organique' | 'Loi Ordinaire' | 'Ordonnance' | 'Constitution' | 'Autre';

export interface TemplateDefintion {
    id: string;
    code: string;
    title: string;
    category: CategorieActe;
    type: TemplateType;
    description: string;
    authority: string;
    version: string;
    format: 'DOCX' | 'PDF';
    isFrequent?: boolean;
    formSchema: FormSchema;
    createEmptyData: () => DocumentData;
}