import { getTableRecords } from "@/utils/airtable";
import { Project } from "@/types/Project";
import { syncStudentProjects } from "./student";


const tableName = process.env.AIRTABLE_TABLE_PROJET!;

export const getProjets = async (): Promise<Project[]> => {
  const records = await getTableRecords(tableName);
  return records as Project[];
};

export const createProjet = async (fields: Partial<Project["fields"]>) => {
  const Airtable = await import("airtable");

  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  const table = base("project"); 

  const safeFields: Partial<Project["fields"]> = {
    ...(fields.name && { name: fields.name }),
    ...(fields.description && { description: fields.description }),
    ...(fields.link && fields.link !== "" && { link: fields.link }),
    ...(Array.isArray(fields.students) && { students: fields.students }),
    ...(Array.isArray(fields.subjects) && { subjects: fields.subjects }),
    ...(typeof fields.visibility === "boolean" && { visibility: fields.visibility }),
  };

  const record = await table.create([{ fields: safeFields }]);
  return record[0];
};


export const updateProjet = async (id: string, fields: Partial<Project["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  const table = base(process.env.AIRTABLE_TABLE_PROJET!);

  const safeFields: Partial<Project["fields"]> = {
    ...(fields.name && { name: fields.name }),
    ...(fields.description && { description: fields.description }),
    ...(fields.link && fields.link !== "" && { link: fields.link }),
    ...(Array.isArray(fields.students) && { students: fields.students }),
    ...(Array.isArray(fields.subjects) && { subjects: fields.subjects }),
    ...(typeof fields.visibility === "boolean" && { visibility: fields.visibility }),
  };

  console.log("Mise à jour projet :", id, safeFields);

  const record = await table.update([{ id, fields: safeFields }]);
  if (fields.students) {
    const previous = fields.students || [];
    await syncStudentProjects(id, fields.students, previous);
  }
  return record[0];
};


export const deleteProjet = async (id: string) => {
  const Airtable = await import("airtable");

  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  const table = base("project"); 
  const deleted = await table.destroy([id]);
  console.log("Projet supprimé :", deleted);

  return { success: true };
};




