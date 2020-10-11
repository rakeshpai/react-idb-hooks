import { Table } from "dexie";
import { useCallback } from "react";
import { DatabaseChangeType, IDatabaseChange } from "dexie-observable/api";
import useQueryWithObserver from './use-query-with-observer';

const isChangeCreateOrDelete = (change: IDatabaseChange) =>
  change.type === DatabaseChangeType.Create
  || change.type === DatabaseChangeType.Delete

export default <T, U, V extends T[]>(
  table: Table<T, U>,
  query: (table: Table<T, U>) => Promise<V>
) => {
  const fetcher = useCallback(() => query(table), [query, table]);
  const observer = useCallback((state: V, changes: IDatabaseChange[]) => {
    const primaryKeyName = table.schema.primKey.name as keyof T;

    if (changes.some(isChangeCreateOrDelete)) return fetcher();

    return changes.reduce(
      (state, change) => {
        // Useless line to keep TS happy
        if (change.type !== DatabaseChangeType.Update) return state;

        return state.map(row => 
          row[primaryKeyName] === change.key ? change.obj as T : row
        ) as V;
      },
      state
    );
  }, [table, fetcher]);

  return useQueryWithObserver(table, fetcher, observer);
};
