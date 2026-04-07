import patientData from '../../data/patients.ts';
import type { Patient, NonSsnPatient, NewPatient } from '../types.ts';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData;

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSsnPatients = (): NonSsnPatient[] => {
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
    ...patient
  };
  
  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getNonSsnPatients,
  addPatient
};