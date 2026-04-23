import { useParams } from "react-router-dom";
import { Diagnosis, Entry, EntryFormValues, Patient } from "../../types";
import { Container, Typography, Button } from '@mui/material';
import { useState, useEffect } from "react";
import patients from "../../services/patients";
import SingleEntry from "./SingleEntry";
import AddEntryModal from "../AddEntryModal";
import patientService from "../../services/patients";
import axios from "axios";

const SinglePatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      const data = await patients.getPatientById(id);
      setPatient(data);
    };

    void fetchPatient();
  }, [id]);

  const submitNewEntry = async (values: EntryFormValues) => { 
    if (!patient) return;
    try {
      const entry = await patientService.createEntry(values, patient.id);
      setPatient(prev =>
        prev ? { ...prev, entries: prev.entries.concat(entry) } : prev
      );
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const data = e.response?.data;
        if (data && typeof data === "object" && "error" in data && Array.isArray(data.error)) {
          const message = data.error
            .map((issue: { path?: Array<string | number>; message?: string }) => {
              const field = issue.path?.join(".") || "input";
              return `${field}: ${issue.message || "Invalid value"}`;
            })
            .join("\n");
          setError(message || "Validation error");
        } else if (typeof data === "string") {
          setError(data.replace('Something went wrong. Error: ', ''));
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };


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
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        diagnoses={diagnoses}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </Container>
  );
};

export default SinglePatientPage;