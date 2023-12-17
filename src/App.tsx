import './App.css'
import { useForm, SubmitHandler } from "react-hook-form"
import { AgeVerification, ageVerification } from './schema'
import { valibotResolver } from '@hookform/resolvers/valibot';


function App() {
  const { register, handleSubmit, formState: {errors} } = useForm<AgeVerification>({
    resolver: valibotResolver(ageVerification),
    defaultValues: {
      age: "20" as unknown as number
    }
  });

  const onSubmit: SubmitHandler<AgeVerification> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>年齢を入力してください</p>
      <input {...register("age")} />
      {errors.age?.message && <p style={{color: 'red'}}>{errors.age.message}</p>}
      <button type='submit'>submit</button>
    </form>
  )
}

export default App
