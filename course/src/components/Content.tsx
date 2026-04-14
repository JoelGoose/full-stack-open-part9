import type { CoursePart } from "../types"

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (<div><i>{part.description}</i></div>)
    case "group":
      return (<div>project exercises {part.groupProjectCount}</div>)
    case "background":
      return (
      <div>
        <i>{part.description}</i>
        <div>submit to {part.description}</div>
      </div>)
    case "special":
      return (
        <div>
          <div><i>{part.description}</i></div>
          required skills: {part.requirements.join(", ")}
        </div>
      )
    default:
      return assertNever(part)
  }
}

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return(
    <div>
      {courseParts.map(part => 
        <div key={part.name}>
          <strong>{part.name} {part.exerciseCount}</strong>
          <Part part={part}/>
          <br/>
        </div>
      )}
    </div>
  )
}

export default Content