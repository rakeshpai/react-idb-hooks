import { Table } from 'dexie';
import { IDatabaseChange } from "dexie-observable/api";
import { useCallback, useEffect } from "react";

type IDBChangeListener = (changes: IDatabaseChange[]) => void;

export default <T, U>(table: Table<T, U>, listener: IDBChangeListener) => {
  const internalListener = useCallback((changes: IDatabaseChange[], partial: boolean) => {
    if (partial) return;

    const relevantChanges = changes.filter(
      change => change.table === table.name
    );

    if (relevantChanges.length) listener(relevantChanges);
  }, [table, listener]);

  useEffect(() => {
    // @ts-ignore
    table.db.on('changes', internalListener);
    return () => {
      // @ts-ignore
      table.db.on('changes').unsubscribe(internalListener);
    }
  }, [table, internalListener]);
};
