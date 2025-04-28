export type Student = {
  id: string;
  fields: {
    lastname: string;
    firstname: string;
    email: string;
    class: string;
    projects: string[];
  };
};
