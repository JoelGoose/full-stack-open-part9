import { Diagnosis, Entry } from "../../types";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const SingleEntry = ({ entry, diagnoses }: Props) => {
  
  const diagnosisName = (code: string) => {
    const diagnosis = diagnoses.find((diagnosis) => (diagnosis.code === code));
    console.log(diagnosis);

    if (!diagnosis) {
      return '';
    }

    return diagnosis.name;
  };
  
  return (
    <div>
      <u><b>{entry.date}</b></u>
      <div>{entry.description}</div>
      <ul>
        {entry.diagnosisCodes?.map((diagnosisCode) => (
          <li key={diagnosisCode}>{diagnosisCode} {diagnosisName(diagnosisCode)}</li>
        ))}
      </ul>
    </div>
  );
};

export default SingleEntry;