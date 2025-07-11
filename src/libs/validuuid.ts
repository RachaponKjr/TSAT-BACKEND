function isValidUUID(uuid: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    uuid
  );
}
function normalizeUUID(value: any): string | null {
  if (typeof value === 'string' && /^[0-9a-fA-F\-]{36}$/.test(value)) {
    return value; // UUID ถูกต้อง
  }
  return null; // ถ้าไม่ใช่ UUID, ให้เป็น null
}

export { isValidUUID, normalizeUUID };
