import patientData from '../../data/patients.ts';
import type { Patient, NonSensitivePatient, NewPatient, NewEntry, Entry } from '../types.ts';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData;

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = ( patient: NewPatient ): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...patient
  };
  
  patients.push(newPatient);
  return newPatient;
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addEntry = ( entry: NewEntry, patientId: string ): Entry => {  
  const patient = getPatientById(patientId);
  if (!patient) {
    throw new Error('No patient found');
  }
  const newEntry = {
    id: uuid(),
    ...entry
  };
  patient.entries.push(newEntry);
  return newEntry;
};


export default {
  getPatients,
  getNonSsnPatients: getNonSensitivePatients,
  addPatient,
  getPatientById,
  addEntry
};