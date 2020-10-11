# Work in progress

This doesn't work, isn't published to npm, and APIs _will_ change.

# React hooks for IndexedDB
Built on top of `dexie` and `dexie-observable`. Queries IndexedDB, and keeps the UI updated with the latest values in IndexedDB, no matter where it's updated from - workers, service worker or other tabs.

## useFullTable
Fetches all the data in a table, and keeps the UI refreshed with the latest changes to the table.

```js
import React from 'react';
import { useFullTable } from 'react-idb-hooks';
import { db } from './somewhere';

const FriendsList = () => {
  const friends = useFullTable(db.friends);

  if (friends === 'loading') return <Loader />;

  return friends.map(friend => (
    <li>{friend.name}</li>
  ));
};
```

## useRows
Fetches some rows from a table, and ensures that the data returned is always up-to-date with the DB state.

```js
import React from 'react';
import { useRows } from 'react-idb-hooks';
import { db } from './somewhere';

const FriendsList = () => {
  const friends = useRows(
    db.friends,
    friends => friends.where('firstaName').anyOf('Alice', 'Bob')
  );

  if (friends === 'loading') return <Loader />;

  return friends.map(friend => (
    <li>{friend.name}</li>
  ));
};
```

## License
IST, whatever that means. Just use this. I'm not out to get you. Pinky promise that you'll help make it better though - you have to agree to that.
