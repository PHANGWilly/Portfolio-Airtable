export type Project = {
  id: string;
  fields: {
    name: string;
    description?: string;
    link?: string;
    students?: string[];
    visibility?: "checked" | undefined;
    subjects?: string[];
    likes?: string[];
  };
};
