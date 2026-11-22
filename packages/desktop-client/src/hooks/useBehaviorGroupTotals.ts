import type { CategoryGroupEntity } from '@actual-app/core/types/models';

import { envelopeBudget, trackingBudget } from '#spreadsheet/bindings';

import { useSheetSum } from './useSheetSum';
import { useSyncedPref } from './useSyncedPref';

/**
 * Totals for a virtual behavior group in the current budget month.
 *
 * Virtual groups have no spreadsheet cells of their own, so the totals are
 * the sum of their categories' cells. Like real category group totals, this
 * includes hidden categories.
 */
export function useBehaviorGroupTotals(group: CategoryGroupEntity) {
  const [budgetType = 'envelope'] = useSyncedPref('budgetType');
  const bindings = budgetType === 'tracking' ? trackingBudget : envelopeBudget;

  const categoryIds = (group.categories ?? []).map(category => category.id);

  const budgeted = useSheetSum(
    categoryIds.map(id => bindings.catBudgeted(id)),
  );
  const spent = useSheetSum(categoryIds.map(id => bindings.catSumAmount(id)));
  const balance = useSheetSum(categoryIds.map(id => bindings.catBalance(id)));

  return { budgeted, spent, balance };
}
