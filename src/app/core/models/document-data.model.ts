export interface VisaItem{
    id: string;
    ordre?: number;
    texte: string;
}

export interface ArticleItem{
    id: string;
    numero: string;
    titre?: string;
    contenu: string;
}

export interface SignataireItem{
    id?: string;
    titre:string;
    nom?:string;
    qualite?:string;
}

export interface EnteteData{
    republique: string;
    devise: string;
    ministere: string;
    sigleMinistere?: string;
    direction?: string;
    visaControle?: string
}

export interface IdentificationData{
    typeActe: string;
    numero: string;
    annee?: string;
    objet?: string;
}

export interface ClotureData{
    faitA: string;
    dateSignature?: string;
    signatairePrincipal: SignataireItem;
    contresignataires?: SignataireItem[];
}

export interface DocumentData{
    id?:string;
    typeActe: string;
    enTete: EnteteData;
    identification: IdentificationData;
    visas?: VisaItem[];
    articles: ArticleItem[];
    cloture: ClotureData;
    autorite: string;
    formulePivot: string;
    [key:string]: any;
}
