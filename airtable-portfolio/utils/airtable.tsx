import Airtable from "airtable";

console.log("API_KEY", process.env.AIRTABLE_API_KEY);
console.log("BASE_ID", process.env.AIRTABLE_BASE_ID);

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const getTableRecords = async (tableName: string) => {
  const records = await base(tableName).select().all();
  return records.map((record) => ({
    id: record.id,
    fields: record.fields,
  }));
};
