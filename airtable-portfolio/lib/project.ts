import { getTableRecords } from "@/utils/airtable";
import { Project } from "@/types/Project";

const tableName = process.env.AIRTABLE_TABLE_PROJET!;

export const getProjets = async (): Promise<Project[]> => {
  const records = await getTableRecords(tableName);
  return records as Project[];
};

export const createProjet = async (fields: Partial<Project["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.create([{ fields }]);
  return record[0];
};

export const updateProjet = async (id: string, fields: Partial<Project["fields"]>) => {
  console.log("Mise à jour projet :", id, fields);
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.update([{ id, fields }]);
  return record[0];
};

export const deleteProjet = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  await table.destroy([id]);
  return { success: true };
};
