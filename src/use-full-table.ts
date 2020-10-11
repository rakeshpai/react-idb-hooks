import { DatabaseChangeType, IDatabaseChange } from 'dexie-observable/api';
import { useCallback } from 'react';
import useQueryWithObserver from './use-query-with-observer';

export default <T, U>(table: Dexie.Table<T, U>) => {
  const fullTableFetcher = useCallback(() => table.toArray(), [table]);
  const observer = useCallback((state: T[], changes: IDatabaseChange[]) => {
    const primaryKeyName = table.schema.primKey.name as keyof T;

    return changes.reduce(
      (state, change) => {
        // Note: change notifications can be delayed!!! This isn't super
        // critical here when an entry is modified or deleted, but can create
        // duplicate entries in memory when an entry is created.

        if (change.type === DatabaseChangeType.Create) {
          // It's possible that we queried immediately after someone created
          // a new record. In this case, the change notification might come
          // after we've set up the listener for a record we already have.
          // We need to check if a new entry is indeed new before storing
          // it in memory.
          if (state.find(row => row[primaryKeyName] === change.key)) return state;
          return [...state, change.obj];
        } else if (change.type === DatabaseChangeType.Delete) {
          return state.filter(row => row[primaryKeyName] === change.key);
        } else {
          return state.map(row =>
            row[primaryKeyName] === change.key ? change.obj : row
          );
        }
      },
      state
    )
  }, [table]);

  return useQueryWithObserver(table, fullTableFetcher, observer) as T[] | 'loading';
};
