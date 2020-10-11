import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import useFullTable from '../src/use-full-table';
import { clearDB, createDB, dbData, populateDB } from './db-helpers';

describe('useTable', () => {
  let db: ReturnType<typeof createDB>;
  beforeEach(async () => {
    db = createDB();
    await clearDB(db);
    await db.open();
    await populateDB(db);
  });

  it('should read data from a table without a query', async () => {
    const { result } = renderHook(() => useFullTable(db.phones));

    expect(result.current).to.eql('loading');

    await waitFor(() => expect(result.current).to.not.eql('loading'));

    expect(result.current).to.eql(dbData.phones);

    await act(() => db.phones.put({ contactId: 10, phone: 'abcabc', type: 'home' }));

    await waitFor(() => {
      expect(result.current.length).to.eql(dbData.phones.length + 1);
    });
  });
});
