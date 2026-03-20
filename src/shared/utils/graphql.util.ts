import { GraphQLResolveInfo, SelectionSetNode } from 'graphql';

export function getSelectFields(data: {
  info: GraphQLResolveInfo | undefined;
  path?: string;
  relations?: string[];
  maxDepth?: number;
}): string[] {
  if (!data.info) return [];

  const fieldNode = data.info.fieldNodes[0];
  let selectionSet = fieldNode.selectionSet;
  if (!selectionSet) return [];

  if (data.path) {
    const targetField = selectionSet.selections.find(
      (selection) => 'name' in selection && selection.name.value === data.path,
    );
    if (
      !targetField ||
      !('selectionSet' in targetField) ||
      !targetField.selectionSet
    ) {
      return [];
    }
    selectionSet = targetField.selectionSet;
  }

  const relations = data.relations ?? [];
  const maxDepth = data.maxDepth ?? 10;

  const traverse = (set: SelectionSetNode, prefix = '', currentDepth = 0): string[] => {
    if (currentDepth >= maxDepth) {
      return [];
    }

    return set.selections.flatMap((selection) => {
      if (selection.kind !== 'Field' || selection.name.value === '__typename') {
        return [];
      }

      const fieldName = selection.name.value;
      // fullPath ví dụ: "role", "settings.role", "member.role"
      const fullPath = prefix ? `${prefix}.${fieldName}` : fieldName;

      // === NÂNG CẤP Ở ĐÂY ===
      // Check xem fullPath này có nằm trong danh sách relation cần chặn không
      if (relations.includes(fullPath)) {
        return [fullPath];
      }
      // ======================

      if (selection.selectionSet) {
        return traverse(selection.selectionSet, fullPath, currentDepth + 1);
      }

      return [fullPath];
    });
  };

  return traverse(selectionSet);
}

