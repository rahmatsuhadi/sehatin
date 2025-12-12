export type Gender = "male" | "female";
export type GoalType = "maintain" | "lose" | "gain";
export type ActivityLevel = "moderate";

// user type
export interface User {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  birth_date: string;
  height_cm: number;
  current_weight_kg: number;
  goal_type: GoalType;
  activity_level: ActivityLevel;
  bmi: number;
  tdee_kcal: number;
  ideal_weight_kg: number;
  target_weight_kg?: number;
  last_checkin_at: string;
  created_at: string;
  updated_at: string;
}

//  Weight check-in interfaces

export interface Weight {
  weight_kg: number;
  bmi: number;
  log_date: string;
  created_at: string; // The date string from the API
}

export type MealsType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meals {
  id: string;
  label: string;
  meal_type: MealsType;
  eaten_at: string;
  total_calories_kcal: number;
  items_count: number;

  name_detected: string;
  name_final: string;
  calories_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}
