import { Dayjs } from "dayjs";
import { InternsInformation } from "./internsInterface";

// TODO: refactor EventDetails ocurrences to use Event
export interface EventDetails {
  title: string;
  date: Dayjs;
  endDate: Dayjs;
  duration: number;
  scholarshipHours: string;
  location: string;
  maxParticipants: number;
  minParticipants: number;
  description: string;
  responsiblePerson: string;
  status: "PENDIENTE" | "ACEPTADO" | "RECHAZADO";
}

export interface Event {
  id?: number;
  title: string;
  description?: string;
  assigned_hours: number;
  start_date: string;
  end_date: string;
  duration_hours: number;
  location: string;
  max_interns: number;
  min_interns: number;
  responsible_intern_id?: number;
  registration_deadline: string;
  start_cancellation_date?: string;
  end_cancellation_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventInformations extends Event {
  accepted_interns: string;
  pending_interns: string;
}
export interface FullEvent extends Event {
  interns: InternsInformation[];
}

export interface EventInternsType extends Event {
  type: string;
}

export interface EventInterns {
  id_intern: number;
  id_event: number;
  worked_hours: number;
  type: string;
  attendance: boolean;
  notes: string;
  created_at: Dayjs;
  updated_at: Dayjs;
}
