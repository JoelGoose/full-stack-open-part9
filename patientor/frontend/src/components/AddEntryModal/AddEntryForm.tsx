import { useState, SyntheticEvent } from "react";

import { TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent } from '@mui/material';

import { Diagnosis, EntryFormValues } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnoses: Diagnosis[]
}

type EntryType = "Hospital" | "OccupationalHealthcare" | "HealthCheck" 

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [selectedType, setSelectedType] = useState<EntryType>("HealthCheck");  
  
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [dischargeDate, setDischargedate] = useState('');
  const [criteria, setCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('');

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseSubmit = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };

    if (selectedType === 'Hospital') {
      onSubmit({
        ...baseSubmit,
        type: 'Hospital',
        discharge: {
          date: dischargeDate,
          criteria
        }
      });
      return;
    }

    if (selectedType === 'OccupationalHealthcare') {
      onSubmit({
        ...baseSubmit,
        type: 'OccupationalHealthcare',
        employerName,
        sickLeave: sickLeaveStartDate && sickLeaveEndDate
          ? {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate
          }
          : undefined
      });
      return;
    }

    onSubmit({
      ...baseSubmit,
      type: 'HealthCheck',
      healthCheckRating: Number(healthCheckRating) as 0 | 1 | 2 | 3
    });
  };

  const entryTypeOptions = [
    { value: "Hospital", label: "Hospital" },
    { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
    { value: "HealthCheck", label: "Health Check" }
  ] as const;

  const HealthCheckOptions = [
    { value: 0, label: "0 - Healthy" },
    { value: 1, label: "1 - Low Risk" },
    { value: 2, label: "2 - High Risk" },
    { value: 3, label: "3 - Critical Risk" }
  ];

  const onTypeChange = (event: SelectChangeEvent<EntryType>) => {
    setSelectedType(event.target.value as EntryType);
  };

  const onHealthRatingChange = (event: SelectChangeEvent<string>) => {
    setHealthCheckRating(event.target.value);
  };

  const onDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <InputLabel id="entry-type" sx={{ marginTop: 2.5 }}>Select type of visit</InputLabel>
      <Select
        labelId="entry-type"
        fullWidth
        value={selectedType}
        onChange={onTypeChange}
      >
        {entryTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <hr style={{ border: "1px solid lightgrey"}}/>
      <form onSubmit={addEntry}>
        <TextField
          label="Description"
          fullWidth 
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <InputLabel id="diagnosis-codes" sx={{ marginTop: 2.5 }}>Diagnosis Codes</InputLabel>
        <Select
          labelId="diagnosis-codes"
          multiple
          fullWidth
          value={diagnosisCodes}
          onChange={onDiagnosisCodesChange}
          renderValue={(selected) => selected.join(', ')}
        >
          {diagnoses.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              {diagnosis.code} - {diagnosis.name}
            </MenuItem>
          ))}
        </Select>
        {selectedType === 'Hospital' && (
          <div>
            <TextField
              label="Discharge date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargedate(target.value)}
            />
            <TextField
              label="Criteria"
              fullWidth
              value={criteria}
              onChange={({ target }) => setCriteria(target.value)}
            />
          </div>
        )}
        {selectedType === 'OccupationalHealthcare' && (
          <div>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              label="Sick Leave Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
            />
            <TextField
              label="Sick Leave End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
            />
          </div>
        )}
        {selectedType === 'HealthCheck' && (
          <div>
            <InputLabel id="health-rating" sx={{ marginTop: 2.5 }}>Select Health Rating</InputLabel>
            <Select
              labelId="health-rating"
              fullWidth
              value={healthCheckRating}
              onChange={onHealthRatingChange}
            >
            {HealthCheckOptions.map((option) => (
              <MenuItem key={option.value} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
            </Select>
          </div>
        )}


        <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
          <Grid size="auto">
            <Button
              color="secondary"
              variant="contained"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid size="auto">
            <Button
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;