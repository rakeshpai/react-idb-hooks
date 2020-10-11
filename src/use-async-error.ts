// Based on https://medium.com/trabe/catching-asynchronous-errors-in-react-using-error-boundaries-5e8a5fd7b971

import { useCallback, useState } from "react";

export default () => {
  const [_, setError] = useState();
  return useCallback(
    e => { setError(() => { throw e; }); },
    [setError],
  );
};
