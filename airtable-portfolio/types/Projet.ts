export type Projet = {
  id: string;
  fields: {
    Nom: string;
    Description?: string;
    Lien?: string;
    Etudiants?: string[];
    Visibilité?: boolean;
    Matière?: string[];
    Likes?: string[];
    Semestre: string;
    Annee: number;
  };
};
