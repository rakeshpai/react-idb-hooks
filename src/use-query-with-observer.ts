import { IDatabaseChange } from 'dexie-observable/api';
import { useCallback, useEffect, useState } from 'react';
import useAsyncError from './use-async-error';
import useObservableListener from './use-observable-listener';

export default <T, U>(
  table: Dexie.Table<T, U>,
  query: (table: Dexie.Table<T, U>) => Promise<T | T[]>,
  observer: (changes: IDatabaseChange[]) => Promise<T | T[]> | T | T[]
) => {
  const throwError = useAsyncError();
  const [data, setData] = useState<T[] | T | 'loading'>('loading');

  useEffect(() => {
    query(table).then(setData).catch(throwError);
  }, [query, table, setData, throwError]);

  const internalObserver = useCallback(async (changes: IDatabaseChange[]) => {
    try {
      const result = await observer(changes);
      setData(result);
    } catch (e) {
      throwError(e);
    }
  }, []);

  useObservableListener(table, internalObserver);

  return data;
};
