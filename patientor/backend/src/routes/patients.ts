import express, { type Response } from 'express';
import patientService from '../services/PatientService.ts';
import { NewEntrySchema, NewPatientSchema, type NonSensitivePatient, type Patient } from '../types.ts';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  const data = patientService.getNonSsnPatients();
  res.send(data);
});

router.post('/', (req, res) => {
  try {
    const newPatient = NewPatientSchema.parse(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});

router.get('/:id', (req, res: Response<Patient | { error: string }>) => {
  const patient = patientService.getPatientById(req.params.id);
  if (patient === undefined) {
    return res.status(404).json({ error: 'patient not found' });
  }
  return res.json(patient);
});

router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = NewEntrySchema.parse(req.body);
    const addedEntry = patientService.addEntry(newEntry, req.params.id);
    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});

export default router;