import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { q } from '@actual-app/core/shared/query';
import type {
  CategoryEntity,
  CategoryGroupEntity,
  NoteEntity,
} from '@actual-app/core/types/models';

import {
  buildBehaviorGroups,
  parseCategoryBehavior,
} from '#components/budget/behaviorGrouping';
import type {
  BehaviorGroupKey,
  CategoryBehavior,
} from '#components/budget/behaviorGrouping';

import { useLocalPref } from './useLocalPref';
import { useQuery } from './useQuery';

/**
 * Live map of category id to the behavior declared in its notes (`#type ...`).
 * Only notes containing `#type` are loaded.
 */
export function useCategoryBehaviors(): ReadonlyMap<
  CategoryEntity['id'],
  CategoryBehavior
> {
  const { data } = useQuery<Pick<NoteEntity, 'id' | 'note'>>(
    () =>
      q('notes')
        .filter({ note: { $like: '%#type%' } })
        .select(['id', 'note']),
    [],
  );

  return useMemo(() => {
    const behaviors = new Map<CategoryEntity['id'], CategoryBehavior>();
    for (const { id, note } of data ?? []) {
      const behavior = parseCategoryBehavior(note);
      if (behavior) {
        behaviors.set(id, behavior);
      }
    }
    return behaviors;
  }, [data]);
}

/**
 * Returns the category groups to display on the budget page. In behavior
 * view these are virtual groups built from `#type` notes; otherwise they are
 * the user's own category groups, unchanged.
 */
export function useBehaviorGrouping(categoryGroups: CategoryGroupEntity[]) {
  const { t } = useTranslation();
  const [groupBy = 'categoryGroup'] = useLocalPref('budget.groupBy');
  const isBehaviorView = groupBy === 'behavior';
  const behaviors = useCategoryBehaviors();

  const displayGroups = useMemo(() => {
    if (!isBehaviorView) {
      return categoryGroups;
    }

    const labels: Record<BehaviorGroupKey, string> = {
      fixed: t('Fixed bills'),
      debt: t('Debt'),
      variable: t('Variable spending'),
      irregular: t('Irregular & seasonal'),
      goal: t('Goals & savings'),
      fun: t('Personal & fun'),
      unassigned: t('No behavior set'),
    };

    return buildBehaviorGroups(categoryGroups, behaviors, labels);
  }, [isBehaviorView, categoryGroups, behaviors, t]);

  return { displayGroups, isBehaviorView };
}

/**
 * Current budget grouping preference and a toggle for it.
 */
export function useBudgetGroupByPref() {
  const [groupBy = 'categoryGroup', setGroupBy] =
    useLocalPref('budget.groupBy');
  const isBehaviorView = groupBy === 'behavior';

  function toggleGroupBy() {
    setGroupBy(isBehaviorView ? 'categoryGroup' : 'behavior');
  }

  return { isBehaviorView, toggleGroupBy };
}
