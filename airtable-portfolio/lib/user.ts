import { getTableRecords } from "@/utils/airtable";
import { user } from "@/types/User";

const tableName = process.env.AIRTABLE_TABLE_USER!;

// ⚠️ Test au chargement :
// On essaie de lire 1 enregistrement en mode safe
checkAirtableTable(tableName).catch((err) => {
  console.error("❌ Impossible de lire la table", tableName, ":", err);
});

// PETITE FONCTION qui va try/catch un .select().firstPage()
async function checkAirtableTable(name: string) {
  const Airtable = await import("airtable");
  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  console.log("✅ Checking table:", name);

  // On essaie de lire la première page (quelques enregistrements)
  await base(name).select({ maxRecords: 1 }).firstPage(); // si la table n'existe pas, ça throw direct
  console.log("✅ Table found:", name);
}

/**
 * Récupère tous les users de la table
 */
export const getUsers = async (): Promise<user[]> => {
  const records = await getTableRecords(tableName);
  return records as user[];
};

/**
 * Crée un user
 */
export const createUser = async (fields: Partial<user["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  console.log("🚀 [createUser] Payload envoyé :", {
    firstname: fields.firstname,
    lastname: fields.lastname,
    email: fields.email,
    password: fields.password,
    likes: [],
  });

  try {
    const result = await base(tableName).create([
      {
        fields: {
          firstname: fields.firstname,
          lastname: fields.lastname,
          email: fields.email,
          password: fields.password,
          likes: [],
        },
      },
    ]);

    console.log("✅ [createUser] Enregistrement créé :", result[0]);
    return result[0];
  } catch (error) {
    console.error("❌ [createUser] Erreur :", error);
    throw new Error("Erreur createUser");
  }
};

/**
 * Met à jour un user
 */
export const updateUser = async (id: string, fields: Partial<user["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  console.log("✏️ [updateUser] Payload :", fields);

  try {
    const result = await base(tableName).update([
      {
        id,
        fields: {
          firstname: fields.firstname,
          lastname: fields.lastname,
          email: fields.email,
          password: fields.password,
        },
      },
    ]);
    console.log("✅ [updateUser] Enregistrement mis à jour :", result[0]);
    return result[0];
  } catch (error) {
    console.error("❌ [updateUser] Erreur :", error);
    throw new Error("Erreur updateUser");
  }
};

/**
 * Supprime un user
 */
export const deleteUser = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!);

  console.log("🗑 [deleteUser] ID à supprimer :", id);

  try {
    await base(tableName).destroy([id]);
    console.log("✅ [deleteUser] Supprimé avec succès");
    return { success: true };
  } catch (error) {
    console.error("❌ [deleteUser] Erreur :", error);
    throw new Error("Erreur deleteUser");
  }
};
