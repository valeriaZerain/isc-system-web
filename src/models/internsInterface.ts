import { Dayjs } from "dayjs";

export interface Interns {
  id: number;
  user_profile_id: number;
  total_hours: number;
  pending_hours: number;
  completed_hours: number;
  created_at: Dayjs;
  updated_at: Dayjs;
}

export interface InternsInformation extends Interns {
  id_intern: number;
  username: string;
  name: string;
  lastname: string;
  mothername: string;
  password: string;
  email: string;
  code: number;
  phone: string;
  type: string;
  worked_hours: number;
  registration_date: Dayjs;
  last_update: Dayjs;
}
