import { last } from "lodash";

export type RowData = {
  name: string;
  type: string;
  children?: RowData[];
  showAggregation?: boolean;
  unit?: string | null;
  modusTestId?: string | null;
};

type ValueType = {
  name: string;
  hierarchy: string[];
  isAggregatable?: boolean | null;
  unit?: string | null; // ? only if it is the same for all values with the same name
  modusTestId?: string | null; // ? only if it is the same for all values with the same name
};

export const covertNormalizedRows = (valueTypes: ValueType[]): RowData[] => {
  const rows: RowData[] = [];

  const getGroups = (
    rows: RowData[],
    groupName: string,
    ...subgroups: string[]
  ): RowData[] => {
    let group = rows.find((r) => r.name === groupName);
    if (!group) {
      group = {
        name: groupName,
        type: "group",
        showAggregation: true,
        children: [],
      };
      rows.push(group);
    }
    return subgroups.length > 0
      ? [
          group,
          ...getGroups(group.children!, subgroups[0], ...subgroups.slice(1)),
        ]
      : [group];
  };

  valueTypes.forEach((valueType) => {
    const groups = getGroups(
      rows,
      valueType.hierarchy[0],
      ...valueType.hierarchy.slice(1)
    );
    // set show aggregation false if any of the groups are isAggregatable=false
    if (!valueType.isAggregatable) {
      groups.forEach((g) => (g.showAggregation = false));
    }
    last(groups)!.children!.push({
      name: valueType.name,
      type: "value",
      unit: valueType.unit,
      modusTestId: valueType.modusTestId,
    });
  });

  return rows;
};
