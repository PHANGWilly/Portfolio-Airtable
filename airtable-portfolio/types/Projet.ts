export type Projet = {
  id: string;
  fields: {
    project: string; 
    description?: string;
    link?: string;
    students?: string[];
    visibility?: boolean;
    subjects?: string[];
    likes?: string[];
  };
};
