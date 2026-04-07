import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises} from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height : number = Number(req.query.height);
  const weight : number = Number(req.query.weight);
  if (!height || !weight) return res.status(400).json({ error: "malformatted parameters" });
  const response = {
    height,
    weight,
    bmi: calculateBmi(height, weight)
  };
  return res.json(response);
});

app.post('/exercises', (req, res) => {

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const daily_exercises = req.body.daily_exercises;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const targetValue = req.body.target;
  if (targetValue === undefined || daily_exercises === undefined) return res.status(400).json({ error: "parameters missing" });
  const target : number = Number(targetValue);
  if (Number.isNaN(target)) return res.status(400).json({ error: "malformatted parameters" });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (daily_exercises.length < 2) return res.status(400).json({ error: "malformatted parameters"});
  for (const element of daily_exercises) {
    if (!(typeof element === "number")) return res.status(400).json({ error: "malformatted parameters"});
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return res.json(calculateExercises(daily_exercises, target));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});