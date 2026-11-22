import type {
  CategoryEntity,
  CategoryGroupEntity,
} from '@actual-app/core/types/models';

/**
 * "Behavior" grouping is an alternative, display-only view of the budget.
 * Instead of the user's own category groups, categories are grouped by how
 * their money behaves (fixed bills, everyday variable spending, irregular or
 * seasonal costs, ...). A category opts in by having a line like
 * `#type irregular` in its notes, so no database changes are needed.
 * A `#type` line in a category group's notes sets the default for all
 * categories in that group; a category's own `#type` overrides it.
 */

export const CATEGORY_BEHAVIORS = [
  'fixed',
  'debt',
  'variable',
  'irregular',
  'goal',
  'fun',
] as const;

export type CategoryBehavior = (typeof CATEGORY_BEHAVIORS)[number];

export type BehaviorGroupKey = CategoryBehavior | 'unassigned';

export const BEHAVIOR_TAG = '#type';

const BEHAVIOR_ALIASES: Record<string, CategoryBehavior> = {
  fixed: 'fixed',
  bill: 'fixed',
  bills: 'fixed',
  debt: 'debt',
  debts: 'debt',
  variable: 'variable',
  everyday: 'variable',
  irregular: 'irregular',
  seasonal: 'irregular',
  sinking: 'irregular',
  goal: 'goal',
  goals: 'goal',
  savings: 'goal',
  fun: 'fun',
  personal: 'fun',
};

const BEHAVIOR_GROUP_ID_PREFIX = 'behavior-group-';

// Matches `#type <value>` at the start of a line (leading whitespace allowed).
const BEHAVIOR_LINE_REGEX = /^\s*#type\s+([a-z-]+)\b/i;

/**
 * Returns the behavior declared in a category note, or null if the note has
 * no valid `#type` line. The first valid line wins.
 */
export function parseCategoryBehavior(
  note: string | null | undefined,
): CategoryBehavior | null {
  if (!note) {
    return null;
  }

  for (const line of note.split('\n')) {
    const match = BEHAVIOR_LINE_REGEX.exec(line);
    if (match) {
      const behavior = BEHAVIOR_ALIASES[match[1].toLowerCase()];
      if (behavior) {
        return behavior;
      }
    }
  }

  return null;
}

export function behaviorGroupId(key: BehaviorGroupKey) {
  return `${BEHAVIOR_GROUP_ID_PREFIX}${key}`;
}

export function isBehaviorGroup(
  group: Pick<CategoryGroupEntity, 'id'> | null | undefined,
) {
  return !!group && group.id.startsWith(BEHAVIOR_GROUP_ID_PREFIX);
}

/**
 * Builds the virtual groups shown in behavior view.
 *
 * - Expense categories are regrouped by behavior, in a fixed behavior order.
 *   Within a behavior, categories keep their original order (by category
 *   group, then by position in the group).
 * - A category uses its own behavior, or else its category group's behavior.
 * - Categories with neither go to an "unassigned" group at the end.
 * - Categories in a hidden category group are treated as hidden.
 * - Behaviors with no categories are omitted.
 * - The income group is passed through unchanged, at the end.
 */
export function buildBehaviorGroups(
  categoryGroups: readonly CategoryGroupEntity[],
  behaviorsById: ReadonlyMap<
    CategoryEntity['id'] | CategoryGroupEntity['id'],
    CategoryBehavior
  >,
  labels: Record<BehaviorGroupKey, string>,
): CategoryGroupEntity[] {
  const buckets = new Map<BehaviorGroupKey, CategoryEntity[]>();

  for (const group of categoryGroups) {
    if (group.is_income) {
      continue;
    }

    const groupBehavior = behaviorsById.get(group.id);

    for (const category of group.categories ?? []) {
      const key: BehaviorGroupKey =
        behaviorsById.get(category.id) ?? groupBehavior ?? 'unassigned';
      const bucket = buckets.get(key) ?? [];
      bucket.push(
        group.hidden && !category.hidden
          ? { ...category, hidden: true }
          : category,
      );
      buckets.set(key, bucket);
    }
  }

  const orderedKeys: BehaviorGroupKey[] = [
    ...CATEGORY_BEHAVIORS,
    'unassigned',
  ];

  const behaviorGroups = orderedKeys.flatMap(key => {
    const categories = buckets.get(key);
    if (!categories || categories.length === 0) {
      return [];
    }

    return [
      {
        id: behaviorGroupId(key),
        name: labels[key],
        is_income: false,
        hidden: false,
        categories,
      } satisfies CategoryGroupEntity,
    ];
  });

  const incomeGroups = categoryGroups.filter(group => group.is_income);

  return [...behaviorGroups, ...incomeGroups];
}
