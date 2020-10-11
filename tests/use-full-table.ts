import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import useFullTable from '../src/use-full-table';
import { clearDB, createDB, dbData, PhoneNumber, populateDB } from './db-helpers';

describe('useFullTable', () => {
  let db: ReturnType<typeof createDB>;
  beforeEach(async () => {
    db = createDB();
    await clearDB(db);
    await db.open();
    await populateDB(db);
  });

  afterEach(() => db.close());

  it('should read data from a table and update in case of modification', async () => {
    const { result } = renderHook(() => useFullTable(db.phones));

    // Initial query
    expect(result.current).to.eql('loading');

    await waitFor(() => expect(result.current).to.not.eql('loading'));

    expect(result.current).to.eql(dbData.phones);

    // Insert into table
    await act(() => db.phones.put({ contactId: 10, phone: 'abcabc', type: 'home' }));

    await waitFor(() => {
      expect(result.current.length).to.eql(dbData.phones.length + 1);
    });

    // Modification of row
    await act(() =>
      db.phones.update(dbData.phones[0].id, { type: 'org', phone: 'new-phone' })
    );

    await waitFor(() => {
      const match = (result.current as PhoneNumber[]).find(
        row => row.id === dbData.phones[0].id
      );
      expect(match!.type).to.eql('org');
      expect(match!.phone).to.eql('new-phone');
    })

    // Deletion of row
    await act(() => db.phones.delete(dbData.phones[0].id));

    await waitFor(() => {
      expect(result.current.length === dbData.phones.length - 1);
    });
  });
});
