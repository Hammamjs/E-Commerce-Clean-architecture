export class SqlBuilder {
  static buildUpdate(
    table: string,
    id: string,
    data: Record<string, any>,
    allowedColumns: readonly string[],
    columnMap: Record<string, string>,
  ) {
    const entries = Object.entries(data).filter(
      ([key, value]) => value !== undefined && allowedColumns.includes(key),
    );

    if (!entries.length) {
      throw new Error('No valid fields to update');
    }

    const fields = entries
      .map(([key], i) => `${columnMap[key]} = $${i + 1}`)
      .join(', ');

    const values = entries.map(([, value]): string => value as string);

    return {
      query: `UPDATE ${table} SET ${fields} WHERE id = $${values.length + 1} RETURNING *;`,
      values: [...values, id],
    };
  }

  static buildCreate(
    table: string,
    data: Record<string, any>,
    allowedColumns: readonly string[],
    columnMap: Record<string, string>,
  ) {
    const entries = Object.entries(data).filter(
      ([key, value]) => value !== undefined && allowedColumns.includes(key),
    );

    if (!entries.length) throw new Error('No valid fields to create');

    const columns = entries.map((_, i) => `$${i + 1}`).join(', ');
    const placeholders = entries.map(([key]) => columnMap[key]).join(', ');
    const values = entries.map(([, value]): string => value as string);

    return {
      query: `INSERT INTO ${table} (${placeholders}) VALUES (${columns}) RETURNING *;`,
      values: [...values],
    };
  }
}
