# Work in progress

This doesn't work, isn't published to npm, and APIs _will_ change.

# React hooks for IndexedDB
Built on top of `dexie` and `dexie-observable`. Queries IndexedDB, and keeps the UI updated with the latest values in IndexedDB, no matter where it's updated from - workers, service worker or other tabs.

## useTable
Fetches all the data in a table, and keeps the UI refreshed with the latest changes to the table.

```js
import React from 'react';
import { useTable } from 'react-idb-hooks';
import { db } from './somewhere';

const FriendsList = () => {
  const friends = useTable(db.friends);

  if (friends === 'loading') return <Loader />;

  return friends.map(friend => (
    <li>{friend.name}</li>
  ));
};
```
