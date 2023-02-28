import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'

function App() {

  ////форма с функциями////////////

  useEffect(() => {
    axios.get('https://www.random.org/integers/?num=1&min=-50&max=50&col=1&base=10&format=plain&rnd=new')
      .then(res => setCount(res.data))
  }, [])
  const [count, setCount] = useState(0)
  const countref = useRef(null)

  useEffect(() => {
    countref.current.animate([{
      transform: 'rotateY(0deg)'
    }, {
      transform: 'rotateY(90deg)'
    }, {
      transform: 'rotateY(0deg)'
    }], { duration: 200, easing: 'ease-out' })
  }, [count])



  const INC = () => setCount(count + 1)
  const DEC = () => setCount(count - 1)
  const RND = () => setCount(count + Math.floor(Math.random() * 10))
  const RESET = () => setCount(0)
  const mathFunction = (e) => {
    switch (e) {
      case 'INC':
        INC()
        break;
      case 'DEC':
        DEC()
        break;
      case 'RND':
        RND()
        break;
      case 'RESET':
        RESET()
        break;
    }
  }
  //////////////////////////////////////

  function handleSubmit(e) {
    e.preventDefault();
  }

  ///////форма с валютами///////////////////

  const [curs, setcurs] = useState([])
  const [valute1, setvalute1] = useState(0)
  const [valute2, setvalute2] = useState({})
  const [finalValue, setfinalValue] = useState(0)
  useEffect(() => {
    axios.get(`https://www.cbr-xml-daily.ru/daily_json.js`)
      .then(res => {
        setcurs(res.data.Valute)
      })
  }, [])

  useEffect(() => {
    if (Object.values(curs)[0]) {
      setvalute1(Object.values(curs)[0].Value)
      setvalute2({ Value: Object.values(curs)[0].Value, Nominal: Object.values(curs)[0].Nominal })
    }

  }, [curs])


  function changeInputs(e) {
    if (e.target.id === 'valute1') {
      Object.values(curs).forEach(x => {
        if (e.target.value.toLowerCase() === x.CharCode.toLowerCase()) {
          setvalute1(x.Value)
        }
      })
    }
    if (e.target.id === 'valute2') {
      Object.values(curs).forEach(x => {
        if (e.target.value.toLowerCase() === x.CharCode.toLowerCase()) {
          setvalute2({ Value: x.Value, Nominal: x.Nominal })
        }
      })
    }
    if (e.target.id === 'count') {
      let inputValue = Number(e.target.value)
      if (valute1 && valute2) {
        setfinalValue(valute1 / valute2.Value * valute2.Nominal * inputValue)
      }
    }
  }
  /////////////////////////////////////////////////////////////



  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className='form1_count'>
          <span ref={countref}>{count}</span>
        </div>

        <div className='form1_buttons'>
          <button onClick={() => mathFunction('INC')}>INC</button>
          <button onClick={() => mathFunction('DEC')}>DEC</button>
          <button onClick={() => mathFunction('RND')}>RND</button>
          <button onClick={() => mathFunction('RESET')}>RESET</button>
        </div>

      </form>

      <form onSubmit={handleSubmit}>
        <div className='form2_container'>
          <div className='form2_container_item'>
            <select onChange={changeInputs} name="" id="valute1">
              {curs && Object.keys(curs).map(x => <option key={x} value={x}>{x}</option>)}
            </select>
            <select onChange={changeInputs} name="" id="valute2">
              {curs && Object.keys(curs).map((x, k) => <option key={x + k} value={x}>{x}</option>)}
            </select>
          </div>
          <div className='form2_container_item'>
            <input onInput={changeInputs} type="number" id='count' />
          </div>
          <div className='form2_container_item'>
            <span >{finalValue}</span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default App
