import { Diagnosis, Entry } from "../../types";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const HospitalEntry = ({ entry }: { entry: Extract<Entry, { type: "Hospital" }> }) => {
  return (
    <div>
      <div>Type of visit: Hospital</div>
      <div>Discharged: {entry.discharge.date}</div>
      <div>On the criteria: {entry.discharge.criteria}</div>
    </div>
  );
};

const OccupationalHealthcareEntry = ({ entry }: { entry: Extract<Entry, { type: "OccupationalHealthcare" }> }) => {
  return (
    <div>
      <div>Type of visit: Occupational Healthcare</div>
      <div>Employer: {entry.employerName}</div>
      {entry.sickLeave && (
        <div>Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</div>
      )}
    </div>
  );
};

const HealthCheckEntry = ({ entry }: { entry: Extract<Entry, { type: "HealthCheck" }> }) => {
  return (
    <div>
      <div>Type of visit: Health Check</div>
      <div>Health Rating: {entry.healthCheckRating}</div>
    </div>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandeled type of visit: ${JSON.stringify(value)}`
  );
};

const SingleEntry = ({ entry, diagnoses }: Props) => {
  
  const diagnosisName = (code: string) => {
    const diagnosis = diagnoses.find((diagnosis) => (diagnosis.code === code));
    if (!diagnosis) {
      return '';
    }
    return diagnosis.name;
  };
  
  const renderVisitType = (entry: Entry) => {
    switch(entry.type) {
      case "Hospital":
        return <HospitalEntry entry={entry}/>;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntry entry={entry}/>;
      case "HealthCheck":
        return <HealthCheckEntry entry={entry}/>;
      default:
        return assertNever(entry);
    }
  };

  return (
    <div style={{border: "solid", padding: "3px"}}>
      <u><b>{entry.date}</b></u>
      <div>{entry.description}</div>
      <ul>
        {entry.diagnosisCodes?.map((diagnosisCode) => (
          <li key={diagnosisCode}>{diagnosisCode} {diagnosisName(diagnosisCode)}</li>
        ))}
      </ul>
      {renderVisitType(entry)}
      <p>diagnosed by {entry.specialist}</p>
    </div>
  );
};

export default SingleEntry;