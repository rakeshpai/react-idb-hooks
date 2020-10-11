import { IDatabaseChange } from 'dexie-observable/api';
import { useCallback, useEffect, useState } from 'react';
import useAsyncError from './use-async-error';
import useObservableListener from './use-observable-listener';

export default <T, U, V extends T | T[]>(
  table: Dexie.Table<T, U>,
  query: (table: Dexie.Table<T, U>) => Promise<V>,
  observer: (state: V, changes: IDatabaseChange[]) => Promise<V> | V
) => {
  const throwError = useAsyncError();
  const [data, setData] = useState<V | 'loading'>('loading');

  useEffect(() => {
    query(table).then(setData).catch(throwError);
  }, [query, table, setData, throwError]);

  const internalObserver = useCallback(async (changes: IDatabaseChange[]) => {
    if (data === 'loading') return;

    try {
      const result = await observer(data as V, changes);
      setData(result);
    } catch (e) {
      throwError(e);
    }
  }, [data, observer, setData, throwError]);

  useObservableListener(table, internalObserver);

  return data;
};
