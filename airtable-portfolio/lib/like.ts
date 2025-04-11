import { getTableRecords } from "@/utils/airtable";
import { Like } from "@/types/Like";

const tableName = process.env.AIRTABLE_TABLE_LIKES!;

export const getLikes = async (): Promise<Like[]> => {
  const records = await getTableRecords(tableName);
  return records as Like[];
};

export const createLike = async (fields: Partial<Like["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.create([{ fields }]);
  return record[0];
};

export const updateLike = async (id: string, fields: Partial<Like["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.update([{ id, fields }]);
  return record[0];
};

export const deleteLike = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  await table.destroy([id]);
  return { success: true };
};
