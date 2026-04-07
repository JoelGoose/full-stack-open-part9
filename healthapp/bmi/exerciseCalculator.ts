interface Results {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number,
}

interface Parser {
  target: number,
  input: number[]
}

const parseArguments = (args: string[]): Parser => {
  if (args.length < 3) throw new Error('Not enough arguments');
  const target : number = Number(args[2]);
  if (isNaN(target)) throw new Error('Provided values were not numbers!');
  const input : number[] = [];
  for (let index = 3; index < args.length; index++) {
    const argument : number = Number(args[index]);
    if (isNaN(argument)) throw new Error('Provided values were not numbers!');
    input.push(argument);
  }

  return {
    target: target,
    input: input
  };
};

export const calculateExercises = (input: Array<number>, target: number): Results => {
  const average : number = input.reduce((a, b) => a + b) / input.length;
  let rating : number;
  let ratingDescription : string;
  if (average > target) {
    rating = 3;
    ratingDescription = "Well done! Keep it up";
  } else if (average < target && average > 1.5) {
    rating = 2;
    ratingDescription = "not too bad but could be better!";
  } else {
    rating = 1;
    ratingDescription = "Get moving more! It feels great, trust me!";
  }
  return {
    periodLength: input.length,
    trainingDays: input.filter(n => n > 0).length,
    success: Math.min(...input) >= target,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: average
  };
};

if (process.argv[1] === import.meta.filename) {
  const { target, input } = parseArguments(process.argv);
  console.log(calculateExercises(input, target));
}



