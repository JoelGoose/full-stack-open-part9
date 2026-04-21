import { useParams } from "react-router-dom";
import { Diagnosis, Entry, Patient } from "../../types";
import { Container, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import patients from "../../services/patients";
import SingleEntry from "./SingleEntry";

const SinglePatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      const data = await patients.getPatientById(id);
      setPatient(data);
    };

    void fetchPatient();
  }, [id]);

  if (!id || !patient) {
    return <h2>Loading...</h2>;
  }
  console.log(patient);
  return (
    <Container>
      <Typography variant="h4">{patient.name}</Typography>
      <div>gender: {patient.gender}</div>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <div>date of birth: {patient.dateOfBirth}</div>
      <Typography variant="h4">Entries</Typography>
      {patient.entries.length === 0
      ? <div>No entries added</div>
      : patient.entries.map((entry: Entry) => (
        <SingleEntry key={entry.id} entry={entry} diagnoses={diagnoses}/>
        ))
      }
    </Container>
  );
};

export default SinglePatientPage;