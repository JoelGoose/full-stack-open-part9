export const calculateBmi = (height: number, weight: number) : string => {
  const bmi : number = (weight / (height/100)**2);
  if ( 18.5 <= bmi && bmi <= 25.0) {
    return 'Normal range';
  } else if ( bmi > 25 ) {
    return 'Overweight';
  } else {
    return 'Underweight';
  }
};

if (process.argv[1] === import.meta.filename) {
  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);
  if (!isNaN(height) && !isNaN(weight)) {
    console.log(calculateBmi(height, weight));
  } else {
    throw new Error('Provided values were not numbers!');
  }
}