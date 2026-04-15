import { useState, useEffect } from 'react'
import axios from 'axios'

interface Diary {
  id: number,
  weather: string,
  visibility: string,
  date: string,
  comment: string
}

const weatherOptions = [
  'sunny',
  'rainy',
  'cloudy',
  'stormy',
  'windy',
]

const visibilityOptions = [
  'great',
  'good',
  'ok',
  'poor',
]

const baseURL = 'http://localhost:3000/api/diaries'

function ErrorMessage({ message } : { message: string }) {
  return (
    <div style={{color: 'red', whiteSpace: 'pre-wrap'}}>
      {message}
    </div>
  )
}

function App() {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [weather, setWeather] = useState('')
  const [visibility, setVisibility] = useState('')
  const [date, setDate] = useState('')
  const [comment, setComment] = useState('')

  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get<Diary[]>(baseURL).then(response => {
      console.log(response.data)
      setDiaries(response.data)
    })
  }, [])

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const diaryToAdd = {
      weather: weather,
      visibility: visibility,
      date: date,
      comment: comment
    }
    axios.post<Diary>(baseURL, diaryToAdd).then(response => {
      setDiaries(diaries.concat(response.data))
      setWeather('')
      setVisibility('')
      setDate('')
      setComment('')
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data.error as Array<{ message: string }>
        const errorMessage = errors?.map(err => err.message).join('\n') ?? 'An error occurred'
        setMessage(errorMessage)
        setTimeout(() => {
          setMessage('')
        }, 7000)
      }
    })
  }

  return (
    <div>
      <h1>Flight Diaries</h1>
      <h2>Add new flight diary</h2>
      <ErrorMessage message={message} />
      <form onSubmit={diaryCreation}>
        <div>
          Weather: 
          {weatherOptions.map(w => (
            <label key={w}>
            <input 
              type="radio"
              name='weather'
              value={w}
              checked={weather === w}
              onChange={(event) => setWeather(event.target.value)} />
              {w}
            </label>
          ))}
        </div>
        <div>
          Visibility:
          {visibilityOptions.map(v => (
            <label key={v}>
            <input 
              type="radio"
              name='visibility'
              value={v}
              checked={visibility === v}
              onChange={(event) => setVisibility(event.target.value)} />
              {v}
            </label>
          ))}
        </div>
        <div>
          Date: 
          <input
            value={date}
            type='date'
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          Comment: 
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type='submit'>add</button>
      </form>
      <h2>Diary entries</h2>
      <div>
        {diaries.map((diary) => (
          <div key={diary.id} style={{ marginBottom: '1rem' }}>
            <strong>Date: {diary.date}</strong>
            <div style={{ marginLeft: '1rem' }}>
              <div>Visibility: {diary.visibility}</div>
              <div>Weather: {diary.weather}</div>
              <div>Comment: {diary.comment}</div>
            </div>
          </div>
        ))}
      </div>
    </div>   
  )
}

export default App
