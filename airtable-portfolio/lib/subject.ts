import { getTableRecords } from "@/utils/airtable";
import { Subject } from "@/types/Subject";

const tableName = "subject"; 

export const getSubjects = async (): Promise<Subject[]> => {
  const records = await getTableRecords(tableName);
  return records as Subject[];
};

export const createSubject = async (fields: Partial<Subject["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  const table = base(tableName);

  const safeFields: Partial<Subject["fields"]> = {
    ...(fields.name && { name: fields.name }),
    ...(fields.year && { year: fields.year }),
    ...(fields.cycle && { cycle: fields.cycle }),
    ...(fields.semester && { semester: fields.semester }),
    ...(fields.description && { description: fields.description }),
    ...(Array.isArray(fields.projects) && { projects: fields.projects }),
  };

  const record = await table.create([{ fields: safeFields }]);
  return record[0];
};

export const updateSubject = async (id: string, fields: Partial<Subject["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  const table = base(tableName);

  const safeFields: Partial<Subject["fields"]> = {
    ...(fields.name && { name: fields.name }),
    ...(fields.year && { year: fields.year }),
    ...(fields.cycle && { cycle: fields.cycle }),
    ...(fields.semester && { semester: fields.semester }),
    ...(fields.description && { description: fields.description }),
    ...(Array.isArray(fields.projects) && { projects: fields.projects }),
  };

  const record = await table.update([{ id, fields: safeFields }]);
  return record[0];
};

export const deleteSubject = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  const table = base(tableName);
  await table.destroy([id]);
  return { success: true };
};
