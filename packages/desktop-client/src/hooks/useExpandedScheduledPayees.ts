import type { CategoryEntity } from '@actual-app/core/types/models';

import { useLocalPref } from './useLocalPref';

/**
 * Whether the scheduled payees list is expanded for a budget category, and a
 * toggle for it. Remembered per device.
 */
export function useExpandedScheduledPayees(categoryId: CategoryEntity['id']) {
  const [expandedCategoryIds = [], setExpandedCategoryIds] = useLocalPref(
    'budget.expandedScheduledPayees',
  );
  const isExpanded = expandedCategoryIds.includes(categoryId);

  function toggleExpanded() {
    setExpandedCategoryIds(
      isExpanded
        ? expandedCategoryIds.filter(id => id !== categoryId)
        : [...expandedCategoryIds, categoryId],
    );
  }

  return { isExpanded, toggleExpanded };
}
