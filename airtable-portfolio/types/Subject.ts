export type Subject = {
  id: string;
  fields: {
    subject: string;        
    name: string;            
    year: string;
    cycle: string;
    semester: string;
    description: string;
    projects: string[];      
  };
};
