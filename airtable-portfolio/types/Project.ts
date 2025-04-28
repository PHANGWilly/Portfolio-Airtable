export type Project = {
  id: string;
  fields: {
    name: string;
    description?: string;
    link?: string;
    students?: string[];
    visibility?: boolean;
    subjects?: string[];
    likes?: string[];
  };
};
