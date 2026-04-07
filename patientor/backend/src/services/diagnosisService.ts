import diagnosisData from '../../data/diagnoses.ts';
import type { Diagnosis } from '../types.ts';

const diagnoses: Diagnosis[] = diagnosisData;

const getDiagnoses = () => {
  return diagnoses;
};

export default {
  getDiagnoses
};