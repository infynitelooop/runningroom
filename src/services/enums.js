import api from "./api";

// Fetch all enums in one request
export async function fetchAllEnums() {
  const { data } = await api.get("/enums/all");
  return data;
}