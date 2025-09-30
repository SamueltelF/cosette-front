import { useState } from 'react'
import reactLogo from './assets/des-fundo.png'
import viteLogo from '/des-fundo.png'
import './App.css'
import AppRoute from './Routes/Routes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AppRoute />
    </>
  )
}

export default App
