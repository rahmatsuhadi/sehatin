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
  last_checkin_at: string;
  created_at: string;
  updated_at: string;
}
