export type Etudiant = {
  id: string;
  fields: {
    Nom: string;
    Prénom: string;
    Email: string;
    Classe: string;
    Projet: string[];
  };
};
