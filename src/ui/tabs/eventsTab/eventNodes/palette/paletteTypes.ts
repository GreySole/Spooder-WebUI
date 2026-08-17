import { EventGraphNodeKind } from '../../../../Types';

export interface PaletteOption {
  value: string;
  label: string;
  kind: EventGraphNodeKind;
  moduleName: string;
  nodeTypeId: string;
  defaults: { [key: string]: any };
  // Entries that do something other than add a node (e.g. opening the timer manager).
  onActivate?: () => void;
}

export interface PaletteCategory {
  key: string;
  label: string;
  options: PaletteOption[];
  // When set, this row opens another level of categories instead of a list of options -
  // used to nest every plugin under a single 'Plugins' entry.
  subcategories?: PaletteCategory[];
}

// One top-level menu: 'Triggers', 'Actions' or 'Timers'. The palette buttons render one group
// each; the canvas context menu renders all of them as rows of a single cascade, so both menus
// offer exactly the same tree.
export interface PaletteGroup {
  key: string;
  label: string;
  categories: PaletteCategory[];
}

export interface PaletteSearchResult {
  option: PaletteOption;
  // Where the option lives in the tree, e.g. 'Actions › Plugins › obs' - shown beside the
  // label so two identically named nodes from different modules stay distinguishable.
  path: string;
}

// Flattens every group's tree into a searchable list. Options are matched on their own label
// and on their path, so typing a module name ('obs') finds everything that module contributes.
export function searchPalette(groups: PaletteGroup[], query: string, limit = 50): PaletteSearchResult[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [];
  }
  const results: PaletteSearchResult[] = [];

  function walk(categories: PaletteCategory[], path: string) {
    for (const category of categories) {
      const categoryPath = `${path} › ${category.label}`;
      for (const option of category.options) {
        if (results.length >= limit) {
          return;
        }
        if (option.label.toLowerCase().includes(needle) || categoryPath.toLowerCase().includes(needle)) {
          results.push({ option, path: categoryPath });
        }
      }
      if (category.subcategories?.length) {
        walk(category.subcategories, categoryPath);
      }
    }
  }

  for (const group of groups) {
    walk(group.categories, group.label);
  }
  return results;
}
