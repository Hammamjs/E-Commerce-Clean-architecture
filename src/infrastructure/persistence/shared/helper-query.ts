export class HelperQuery {
  create(
    data: Record<string, any>,
    allowedColumns: string[],
    columnMap: Record<string, string>,
  ) {
    const entries = Object.entries(data).filter(
      ([key, value]) => value !== undefined && allowedColumns.includes(key),
    );

    const toUpdate = entries.map(([k]) => `${columnMap[k]}`).join(', ');
    const toUpdateSignature = entries.map((_, i) => `$${i + 1}`).join(', ');
    const values = entries.map(([, v]) => v as string);

    return {
      toUpdate,
      toUpdateSignature,
      values,
    };
  }

  update(
    data: Record<string, any>,
    allowedColumns: string[],
    columnMap: Record<string, string>,
  ) {
    const entries = Object.entries(data).filter(
      ([key, value]) => value !== undefined && allowedColumns.includes(key),
    );

    const toUpdate = entries
      .map(([k], i) => `${columnMap[k]}=$${i + 1}`) // we need to make data match db
      .join(', ');
    const values = entries.map(([, v]) => v as string);

    return {
      toUpdate,
      values,
    };
  }
}
