import './App.css'
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"

type FormValues = {
  age: number
}

function App() {
  const { register, handleSubmit} = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const age = z.coerce.number().parse(data.age)
    console.log({age})
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>年齢を入力してください</p>
      <input placeholder='20' {...register("age")} />
      <button type='submit'>submit</button>
    </form>
  )
}

export default App
