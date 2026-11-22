import React from 'react';
import { useTranslation } from 'react-i18next';

import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { format as monthUtilFormat } from '@actual-app/core/shared/months';
import { getScheduledAmount } from '@actual-app/core/shared/schedules';
import type { ScheduleStatuses } from '@actual-app/core/shared/schedules';
import type { ScheduleEntity } from '@actual-app/core/types/models';

import { FinancialText } from '#components/FinancialText';
import { PrivacyFilter } from '#components/PrivacyFilter';
import { StatusBadge } from '#components/schedules/StatusBadge';
import { DisplayId } from '#components/util/DisplayId';
import { useDateFormat } from '#hooks/useDateFormat';
import { useFormat } from '#hooks/useFormat';

type ScheduledPayeesListProps = {
  schedules: ScheduleEntity[];
  statuses: ScheduleStatuses;
  /** Narrow layout for mobile: hides the schedule name and status badge. */
  compact?: boolean;
  /** Left indent, so the list lines up with the category name. */
  indent?: number;
};

/**
 * Lists the scheduled payees funded by a category's `#template schedule`
 * lines, with each schedule's next date and amount.
 */
export function ScheduledPayeesList({
  schedules,
  statuses,
  compact = false,
  indent = 0,
}: ScheduledPayeesListProps) {
  const { t } = useTranslation();
  const format = useFormat();
  const dateFormat = useDateFormat() || 'MM/dd/yyyy';

  const sortedSchedules = [...schedules].sort((a, b) =>
    (a.next_date ?? '').localeCompare(b.next_date ?? ''),
  );

  return (
    <View
      role="list"
      aria-label={t('Scheduled payees')}
      style={{
        paddingLeft: indent,
        paddingRight: 10,
        paddingTop: 4,
        paddingBottom: 6,
        backgroundColor: theme.tableRowHeaderBackground,
        borderBottom: `1px solid ${theme.tableBorder}`,
        ...styles.smallText,
      }}
    >
      {sortedSchedules.map(schedule => {
        const status = statuses.get(schedule.id);
        const amount = getScheduledAmount(schedule._amount);
        const isApproximate = schedule._amountOp === 'isapprox';
        const isRange = typeof schedule._amount === 'object';

        return (
          <View
            key={schedule.id}
            role="listitem"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: 24,
              gap: 10,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <DisplayId type="payees" id={schedule._payee} />
              {!compact && schedule.name && (
                <Text
                  style={{ color: theme.pageTextSubdued, fontSize: 11 }}
                  title={schedule.name}
                >
                  {schedule.name}
                </Text>
              )}
            </View>
            <Text
              style={{
                flexShrink: 0,
                color: theme.pageTextSubdued,
                ...styles.tnum,
              }}
            >
              {schedule.next_date
                ? monthUtilFormat(schedule.next_date, dateFormat)
                : t('No date')}
            </Text>
            <PrivacyFilter>
              <FinancialText
                style={{ flexShrink: 0, minWidth: 70, textAlign: 'right' }}
              >
                {(isApproximate || isRange ? '~' : '') +
                  format(amount, 'financial')}
              </FinancialText>
            </PrivacyFilter>
            {!compact && status && (
              <View style={{ flexShrink: 0, width: 110 }}>
                <StatusBadge status={status} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
