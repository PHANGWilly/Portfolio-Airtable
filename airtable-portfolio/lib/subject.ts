import { getTableRecords } from "@/utils/airtable";
import { Matiere } from "@/types/Subject";

const tableName = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_MATIERE!;

export const getMatieres = async (): Promise<Matiere[]> => {
  const records = await getTableRecords(tableName);
  return records as Matiere[];
};

export const createMatiere = async (fields: Partial<Matiere["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.create([{ fields }]);
  return record[0];
};

export const updateMatiere = async (id: string, fields: Partial<Matiere["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.update([{ id, fields }]);
  return record[0];
};

export const deleteMatiere = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  await table.destroy([id]);
  return { success: true };
};
