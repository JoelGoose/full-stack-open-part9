import { z } from 'zod';

export interface Diagnosis {
  code: string
  name: string
  latin?: string
}

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other'
} as const;
export type Gender = typeof Gender[keyof typeof Gender];

export const BaseNewEntrySchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional()
});

const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];

export const NewHealthCheckEntrySchema = BaseNewEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ])
});

export const DischargeSchema = z.object({
  date: z.iso.date(),
  criteria: z.string()
});

export const NewHospitalEntrySchema = BaseNewEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: DischargeSchema
});

export const SickLeaveSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date()
});

export const NewOccupationalHealthcareEntrySchema = BaseNewEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: SickLeaveSchema.optional()
});

// creation of final schemas for NewEntry and Entry assisted with generative AI

export const NewEntrySchema = z.discriminatedUnion('type', [
  NewHospitalEntrySchema,
  NewOccupationalHealthcareEntrySchema,
  NewHealthCheckEntrySchema
]);

export const HospitalEntrySchema = NewHospitalEntrySchema.extend({
  id: z.string()
});

export const OccupationalHealthcareEntrySchema = NewOccupationalHealthcareEntrySchema.extend({
  id: z.string()
});

export const HealthCheckEntrySchema = NewHealthCheckEntrySchema.extend({
  id: z.string()
});

export const EntrySchema = z.discriminatedUnion('type', [
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
  HealthCheckEntrySchema
]);

export type NewEntry = z.infer<typeof NewEntrySchema>;
export type Entry = z.infer<typeof EntrySchema>;


export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string()
});

export type NewPatient = z.infer<typeof NewPatientSchema>;
export interface Patient extends NewPatient {
  id: string;
  entries: Entry[]
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

