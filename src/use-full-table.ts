import { useCallback } from 'react';
import useQueryWithObserver from './use-query-with-observer';

export default <T, U>(table: Dexie.Table<T, U>) => {
  const fullTableFetcher = useCallback(() => table.toArray(), [table]);

  return useQueryWithObserver(table, fullTableFetcher, fullTableFetcher) as T[] | 'loading';
};
