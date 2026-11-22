import React from 'react';

import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';
import type { CategoryGroupEntity } from '@actual-app/core/types/models';

import { Cell } from '#components/table';
import { useBehaviorGroupTotals } from '#hooks/useBehaviorGroupTotals';
import { useFormat } from '#hooks/useFormat';

type BehaviorGroupMonthProps = {
  month: string;
  group: CategoryGroupEntity;
};

/**
 * Month totals for a virtual behavior group on the desktop budget table.
 * Matches the layout of the regular group month row (budgeted, spent,
 * balance), but sums category cells because the group has no cells itself.
 */
export function BehaviorGroupMonth({ month, group }: BehaviorGroupMonthProps) {
  const format = useFormat();
  const { budgeted, spent, balance } = useBehaviorGroupTotals(group);

  const cellStyle = { fontWeight: 600, ...styles.tnum };
  const formatter = (value: string) =>
    value === '' ? '' : format(value, 'financial');

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: monthUtils.isCurrentMonth(month)
          ? theme.budgetHeaderCurrentMonth
          : theme.budgetHeaderOtherMonth,
      }}
    >
      <Cell
        name="budgeted"
        width="flex"
        textAlign="right"
        style={cellStyle}
        value={budgeted == null ? '' : String(budgeted)}
        formatter={formatter}
        privacyFilter
      />
      <Cell
        name="spent"
        width="flex"
        textAlign="right"
        style={cellStyle}
        value={spent == null ? '' : String(spent)}
        formatter={formatter}
        privacyFilter
      />
      <Cell
        name="balance"
        width="flex"
        textAlign="right"
        style={{ ...cellStyle, paddingRight: styles.monthRightPadding }}
        value={balance == null ? '' : String(balance)}
        formatter={formatter}
        privacyFilter
      />
    </View>
  );
}
