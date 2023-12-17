import './App.css'
import { useForm, SubmitHandler } from "react-hook-form"
import { AgeVerification, ageVerification } from './schema'
import { zodResolver } from '@hookform/resolvers/zod';


function App() {
  const { register, handleSubmit } = useForm<AgeVerification>({
    resolver: zodResolver(ageVerification)
  });

  const onSubmit: SubmitHandler<AgeVerification> = (data) => {
    console.log(data)
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
