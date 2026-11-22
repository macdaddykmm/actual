# Categories

You can manage your categories in the budget page. Actual supports both expense and income categories.

Get some background information and recommendations on budget categories in our
[starting fresh](../getting-started/starting-fresh.md#3-setting-up-your-budget-categories) guide.

## Add a Category

1. Hover over the category group and click the **+** (**Add category**) button

   <img width="724" alt="Hovering over the Usual Expenses group shows the Add category button" src="/img/budgeting/categories-group-hover@2x.webp" />

2. Type the name of the new category and press <Key k="enter" />

   <img width="724" alt="A new category called Pets being added to the Usual Expenses group" src="/img/budgeting/categories-new-category@2x.webp" />

## Adding a Category Group

Scroll to the bottom of the budget sheet and select **Add group**

<img width="724" alt="The Add group button above the Income group" src="/img/budgeting/categories-add-group@2x.webp" />

Only one income group can ever exist and it cannot be deleted.

## Renaming or Deleting a Category

1. Hover over the category and press the down arrow

   <img width="724" alt="Hovering over the Food category shows a down arrow next to its name" src="/img/budgeting/categories-category-hover@2x.webp" />

2. Select **Rename** or **Delete** from the menu

   <img width="724" alt="The category menu with Rename, Hide and Delete" src="/img/budgeting/categories-category-menu@2x.webp" />

Categories are organized into groups and the same actions as above can be performed on groups.

## Merging Categories

Let's say you have two categories that are the same but you want to delete one.

<img width="724" alt="The budget with two similar categories, Food and Foods" src="/img/budgeting/categories-duplicates@2x.webp" />

Hover over the category and select the drop down that appears and select `Delete`

<img width="724" alt="The category menu with Rename, Hide and Delete" src="/img/budgeting/categories-category-menu@2x.webp" />

If the category you're deleting has a positive balance **OR** has been used for existing transactions you will be presented with a box to select which category the balance and/or transactions should be moved to.

<img width="512" alt="The Confirm Delete dialog asking which category to transfer the transactions and balance to" src="/img/budgeting/categories-delete-modal@2x.webp" />

In our example, we want to use `Food` which will take over from `Foods` once you are happy with your selection, click `Delete`

<img width="512" alt="The Confirm Delete dialog with Food selected as the category to transfer to" src="/img/budgeting/categories-delete-modal-food@2x.webp" />

You can see in the budget that our categories have now been successfully merged and the positive balance moved to the new category.

<img width="724" alt="The budget after the merge, with Foods gone and its budget and balance added to Food" src="/img/budgeting/categories-merged@2x.webp" />

## Managing Categories

Category groups can be _expanded or collapsed_ by clicking on the arrow to the left of the Category group name. All category groups can be expanded or collapsed at once by using the three-dot menu at the top of the category list.

Categories that are not currently needed can be _hidden_ by using the down arrow by each category name. An example is budgeting savings for a large cost (e.g. washing machine). After the purchase is made, the category can be hidden. Hidden categories still impact your budget. When needed, hidden categories can be viewed by clicking on the three dots at the top of the category list.

<img width="724" alt="The category menu for Washing machine with Hide highlighted" src="/img/budgeting/categories-hide-category@2x.webp" />

<img width="724" alt="The menu at the top of the category list with Toggle hidden categories highlighted" src="/img/budgeting/categories-toggle-hidden@2x.webp" />

Hidden categories, when shown, are displayed in a lower-contrast color. If you find that you now require a category that you have previously hidden, you can unhide it by using the down arrow next to the category name.

<img width="724" alt="The hidden Washing machine category shown in a lower-contrast color" src="/img/budgeting/categories-hidden@2x.webp" />

## Category Notes

It is possible to add notes to Categories. To do this, hover over the category that you would like to add a note to. A paper icon will appear.

<img width="724" alt="Hovering over the Food category shows the paper icon" src="/img/budgeting/categories-notes-icon@2x.webp" />

Click the paper icon and type in your note.

<img width="724" alt="Typing a note for the Food category" src="/img/budgeting/categories-note-add@2x.webp" />

Notes support Markdown syntax for formatted notes.

## Viewing Category Notes

Once a Category has been given a note it is possible to view it in one of two ways.

1. Hover over the paper icon on the category and the note contents will appear for you to view.

   <img width="724" alt="The formatted note shown when hovering over the paper icon" src="/img/budgeting/categories-note-hover@2x.webp" />

2. Click the paper icon. This will open the edit box where you can see the note content and also edit the note, should you wish.

   <img width="724" alt="The note edit box showing the Markdown text of the note" src="/img/budgeting/categories-note-edit@2x.webp" />

## Grouping Categories by Behavior

Your category groups usually follow topics, such as Food, Kids, or Transportation. Sometimes it helps to see your budget grouped by how the money behaves instead: bills that are the same every month, everyday spending that changes from week to week, or costs that only come up a few times a year.

Actual can show the budget grouped this way without changing your category groups. You choose a behavior for each category by adding a line to its [notes](#category-notes).

### Setting a Category's Behavior

1. Open the notes for a category, as described in [Category Notes](#category-notes).
2. On its own line, add `#type` followed by one of the behaviors below. For example: `#type irregular`.
3. Save the note.

| Behavior    | Use it for                                            | Also accepted         |
| ----------- | ----------------------------------------------------- | --------------------- |
| `fixed`     | Bills with the same amount every month                | `bill`, `bills`       |
| `debt`      | Loan and credit card payments                         | `debts`               |
| `variable`  | Everyday spending that changes, like groceries or gas | `everyday`            |
| `irregular` | Seasonal or occasional costs you save up for          | `seasonal`, `sinking` |
| `goal`      | Savings goals and emergency funds                     | `goals`, `savings`    |
| `fun`       | Personal spending money and entertainment             | `personal`            |

The `#type` line can sit next to other content in the note, including budget templates. Only the first valid `#type` line is used.

### Setting a Behavior for a Whole Group

If every category in a group behaves the same way, such as an Insurance or Utilities group, you can set the behavior once on the group instead:

1. Open the notes for the category group. On desktop, click the paper icon next to the group name. On mobile, tap the group name and choose **Edit notes**.
2. Add a `#type` line, for example `#type fixed`, and save the note.

Do this while viewing your regular category groups, since behavior groups don't have notes of their own. Every category in that group now uses that behavior. To make an exception, add a different `#type` line to that category's own notes. A category's own `#type` always takes priority over its group's.

### Switching the View

- On desktop, open the menu next to the category column header and choose **Group by behavior**. Choose **Group by category group** to switch back.
- On mobile, tap the Actual logo at the top left of the budget page and choose **Group by behavior** or **Group by category group**.

In the behavior view:

- Each behavior is shown as a group, with totals for budgeted, spent, and balance.
- Categories with no `#type` line, on the category or its group, appear under **No behavior set**.
- Your income categories are shown as usual.
- Categories can still be budgeted and edited, but categories and groups can't be dragged to a new position. Switch back to the category group view to reorder them.

The view you choose is remembered on each device, so one person can use the behavior view while another keeps the regular view.

## Viewing Scheduled Payees

If a category is funded by [schedule templates](../experimental/goal-templates.md), such as `#template schedule Hulu`, you can see the payees behind it right on the budget page. This is handy for categories made up of a few known bills, like subscriptions or insurance.

For each scheduled payee, the list shows:

- The payee
- The next date the schedule is due
- The scheduled amount (a `~` means the amount is approximate or a range)
- On desktop, the schedule's name and status, such as upcoming, due, or missed

To show the list:

- On desktop, click the small arrow to the left of the category name.
- On mobile, tap **scheduled payees** under the category name.

Click or tap again to hide it. Which lists are open is remembered on each device.

:::note

This needs [budget templates](../experimental/goal-templates.md) to be turned on. A category's scheduled payees appear after its templates have been checked or applied at least once.

:::
