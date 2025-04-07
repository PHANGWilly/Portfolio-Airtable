import { getTableRecords } from "@/utils/airtable";
import { Projet } from "@/types/Projet";

const tableName = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_PROJET!;

export const getProjets = async (): Promise<Projet[]> => {
  const records = await getTableRecords(tableName);
  return records as Projet[];
};

export const createProjet = async (fields: Partial<Projet["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.create([{ fields }]);
  return record[0];
};

export const updateProjet = async (id: string, fields: Partial<Projet["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.update([{ id, fields }]);
  return record[0];
};

export const deleteProjet = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  await table.destroy([id]);
  return { success: true };
};
