import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import useRows from '../src/use-rows';
import { clearDB, createDB, dbData, populateDB } from './db-helpers';

describe('useRows', () => {
  let db: ReturnType<typeof createDB>;
  beforeEach(async () => {
    db = createDB();
    await clearDB(db);
    await db.open();
    await populateDB(db);
  });

  afterEach(() => db.close());

  it('should render some rows', async () => {
    const { result } = renderHook(() => useRows(
      db.contacts,
      contacts => contacts.where('first').anyOf('John', 'Alice').toArray()
    ));

    // Loading...
    expect(result.current).to.eql('loading');

    await waitFor(() => expect(result.current).to.not.eql('loading'));

    expect(result.current.length).to.eql(2);

    // Adding a new record

    await act(() => 
      db.contacts.put({ first: 'Alice', last: 'Jones' })
    );

    await waitFor(() => expect(result.current.length).to.eql(3));

    // Deleting a record

    await act(() =>
      db.contacts.delete(
        dbData.contacts.find(contact => contact.first === 'John')!.id
      )
    );

    await waitFor(() => expect(result.current.length).to.eql(2));

    // Modifying a record
    await act(() =>
      db.contacts.update(
        dbData.contacts.find(contact => contact.first === 'Alice')!.id,
        { first: 'Brimful of Asha'}
      )
    );

    await waitFor(() => {
      const results = result.current;
      if (results === 'loading') throw new Error('keeping ts happy');
      if (!results.some(contact => contact.first === 'Brimful of Asha')) {
        throw new Error('Update didn\'t work');
      }
    });

    // Modifying an unrelated record
    await act(() =>
      db.contacts.update(
        dbData.contacts.find(contact => contact.first === 'Chuck')!.id,
        { first: 'Charlie' }
      )
    );

    await waitFor(() => {
      const results = result.current;
      if (results === 'loading') throw new Error('keeping ts happy');
      if (results.some(contact => contact.first === 'Charlie')) {
        throw new Error('Update reflected the wrong record.');
      }
    })
  });
});
