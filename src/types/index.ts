export interface CalsMacrosPerServing {
  calories: number;
  macrosRel: {
    carbs: number;
    fats: number;
    proteins: number;
  };
  macrosAbs: {
    carbs: number;
    fats: number;
    proteins: number;
  };
  per?: string;
}
