import type { CategoryGroupEntity } from '@actual-app/core/types/models';
import { describe, expect, it } from 'vitest';

import {
  behaviorGroupId,
  buildBehaviorGroups,
  isBehaviorGroup,
  parseCategoryBehavior,
} from './behaviorGrouping';
import type { BehaviorGroupKey, CategoryBehavior } from './behaviorGrouping';

const labels: Record<BehaviorGroupKey, string> = {
  fixed: 'Fixed',
  debt: 'Debt',
  variable: 'Variable',
  irregular: 'Irregular',
  goal: 'Goals',
  fun: 'Fun',
  unassigned: 'Unassigned',
};

const categoryGroups: CategoryGroupEntity[] = [
  {
    id: 'housing',
    name: 'Housing',
    categories: [
      { id: 'mortgage', name: 'Mortgage', group: 'housing' },
      { id: 'repairs', name: 'Repairs', group: 'housing' },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    categories: [
      { id: 'groceries', name: 'Groceries', group: 'food' },
      { id: 'eating-out', name: 'Eating out', group: 'food', hidden: true },
    ],
  },
  {
    id: 'old',
    name: 'Old',
    hidden: true,
    categories: [{ id: 'old-cat', name: 'Old category', group: 'old' }],
  },
  {
    id: 'income',
    name: 'Income',
    is_income: true,
    categories: [
      { id: 'salary', name: 'Salary', group: 'income', is_income: true },
    ],
  },
];

describe('parseCategoryBehavior', () => {
  it('returns null for empty notes', () => {
    expect(parseCategoryBehavior(null)).toBeNull();
    expect(parseCategoryBehavior(undefined)).toBeNull();
    expect(parseCategoryBehavior('')).toBeNull();
  });

  it('reads a #type line anywhere in the note', () => {
    expect(parseCategoryBehavior('#type fixed')).toBe('fixed');
    expect(parseCategoryBehavior('Car fund\n  #type irregular\n')).toBe(
      'irregular',
    );
    expect(parseCategoryBehavior('#template 300 up to 4000\n#type goal')).toBe(
      'goal',
    );
  });

  it('is case-insensitive and supports aliases', () => {
    expect(parseCategoryBehavior('#TYPE Variable')).toBe('variable');
    expect(parseCategoryBehavior('#type bills')).toBe('fixed');
    expect(parseCategoryBehavior('#type sinking')).toBe('irregular');
    expect(parseCategoryBehavior('#type savings')).toBe('goal');
    expect(parseCategoryBehavior('#type personal')).toBe('fun');
  });

  it('ignores unknown values and #type that is not at the start of a line', () => {
    expect(parseCategoryBehavior('#type banana')).toBeNull();
    expect(parseCategoryBehavior('see #type fixed')).toBeNull();
    expect(parseCategoryBehavior('#typefixed')).toBeNull();
  });

  it('uses the first valid #type line', () => {
    expect(parseCategoryBehavior('#type banana\n#type debt\n#type fun')).toBe(
      'debt',
    );
  });
});

describe('isBehaviorGroup', () => {
  it('detects virtual behavior groups only', () => {
    expect(isBehaviorGroup({ id: behaviorGroupId('fixed') })).toBe(true);
    expect(isBehaviorGroup({ id: behaviorGroupId('unassigned') })).toBe(true);
    expect(isBehaviorGroup({ id: 'housing' })).toBe(false);
    expect(isBehaviorGroup(null)).toBe(false);
  });
});

describe('buildBehaviorGroups', () => {
  it('groups categories by behavior in a fixed order and keeps income last', () => {
    const behaviors = new Map<string, CategoryBehavior>([
      ['groceries', 'variable'],
      ['mortgage', 'fixed'],
      ['repairs', 'irregular'],
    ]);

    const result = buildBehaviorGroups(categoryGroups, behaviors, labels);

    expect(result.map(group => group.id)).toEqual([
      behaviorGroupId('fixed'),
      behaviorGroupId('variable'),
      behaviorGroupId('irregular'),
      behaviorGroupId('unassigned'),
      'income',
    ]);
    expect(result[0].name).toBe('Fixed');
    expect(result[0].categories?.map(c => c.id)).toEqual(['mortgage']);
    expect(result[3].categories?.map(c => c.id)).toEqual([
      'eating-out',
      'old-cat',
    ]);
  });

  it('keeps categories linked to their real group', () => {
    const result = buildBehaviorGroups(
      categoryGroups,
      new Map([['repairs', 'irregular']]),
      labels,
    );
    const irregular = result.find(
      group => group.id === behaviorGroupId('irregular'),
    );
    expect(irregular?.categories?.[0].group).toBe('housing');
  });

  it('treats categories in hidden groups as hidden', () => {
    const result = buildBehaviorGroups(categoryGroups, new Map(), labels);
    const unassigned = result.find(
      group => group.id === behaviorGroupId('unassigned'),
    );
    const oldCategory = unassigned?.categories?.find(c => c.id === 'old-cat');
    expect(oldCategory?.hidden).toBe(true);
    expect(categoryGroups[2].categories?.[0].hidden).toBeUndefined();
  });

  it('uses the category group behavior as a default', () => {
    const behaviors = new Map<string, CategoryBehavior>([
      ['housing', 'fixed'],
      ['repairs', 'irregular'],
    ]);

    const result = buildBehaviorGroups(categoryGroups, behaviors, labels);
    const fixed = result.find(group => group.id === behaviorGroupId('fixed'));
    const irregular = result.find(
      group => group.id === behaviorGroupId('irregular'),
    );

    expect(fixed?.categories?.map(c => c.id)).toEqual(['mortgage']);
    expect(irregular?.categories?.map(c => c.id)).toEqual(['repairs']);
  });

  it('ignores a behavior set on the income group', () => {
    const result = buildBehaviorGroups(
      categoryGroups,
      new Map<string, CategoryBehavior>([['income', 'fixed']]),
      labels,
    );
    expect(result.find(group => group.id === 'income')?.categories).toEqual(
      categoryGroups[3].categories,
    );
    expect(
      result.find(group => group.id === behaviorGroupId('fixed')),
    ).toBeUndefined();
  });

  it('omits behaviors with no categories', () => {
    const result = buildBehaviorGroups(categoryGroups, new Map(), labels);
    expect(result.map(group => group.id)).toEqual([
      behaviorGroupId('unassigned'),
      'income',
    ]);
  });
});
