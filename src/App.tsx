import './App.css'
import { AgeVerification } from './schema'
import { useForm, SubmitHandler } from '@modular-forms/react';

function App() {
  const [, {Form, Field}] = useForm<AgeVerification>({});

  const onSubmit: SubmitHandler<AgeVerification> = (data) => {
    console.log(data)
  }

  return (
    <Form onSubmit={onSubmit}>
      <p>年齢を入力してください</p>
      <Field name='age' type='number'>
        {(field, props) => (
          <>
            <input {...props} type='number' />
            {field.error && <p style={{color: 'red'}}>{field.error}</p>}
          </>
        )}
      </Field>
      <button type='submit'>submit</button>
    </Form>
  )
}

export default App
