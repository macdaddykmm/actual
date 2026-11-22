import { useLayoutEffect, useState } from 'react';

import { useCurrentSheetName } from './useSheetName';
import { useSpreadsheet } from './useSpreadsheet';

/**
 * Subscribes to several numeric cells in the current sheet and returns their
 * sum. Returns null until every cell has reported a value. Non-numeric or
 * empty cells count as 0.
 */
export function useSheetSum(cellNames: readonly string[]): number | null {
  const sheetName = useCurrentSheetName();
  const spreadsheet = useSpreadsheet();
  const [sum, setSum] = useState<number | null>(null);

  // Use a stable string key so a new array with the same names does not
  // resubscribe.
  const cellNamesKey = cellNames.join('\n');

  useLayoutEffect(() => {
    const names = cellNamesKey ? cellNamesKey.split('\n') : [];

    if (names.length === 0) {
      setSum(0);
      return;
    }

    let isMounted = true;
    const values = new Map<string, number>();

    function recompute() {
      if (!isMounted || values.size < names.length) {
        return;
      }
      let total = 0;
      for (const value of values.values()) {
        total += value;
      }
      setSum(total);
    }

    const unbinds = names.map(name =>
      spreadsheet.bind(sheetName, name, result => {
        values.set(name, typeof result.value === 'number' ? result.value : 0);
        recompute();
      }),
    );

    return () => {
      isMounted = false;
      for (const unbind of unbinds) {
        unbind();
      }
    };
  }, [spreadsheet, sheetName, cellNamesKey]);

  return sum;
}
