import { useState } from 'react'
import './App.css'

function Success(){
  return (
    <div className='complete-container'>
      <img src='/images/icon-complete.svg' className='complete-img'alt='Complete Icon'/>
      <h1 className='complete-title'>Thank you!</h1>
      <p className='complete-text'>We've added your card details</p>
      <button className='form-btn'>Continue</button>
    </div>
  )
}


function App() {

  const [formData, setFormData] = useState({
    name: "",
    cardNumber : "",
    expM : "",
    expY : "",
    cvv : ""
  })

  const [errors, setErrors] = useState({
    name: null,
    cardNumber : null,
    expM : null,
    expY : null,
    cvv : null
  })

  const [isSuccess, setIsSuccess] = useState(false)

  function handleChange(e){
    if(e.target.name == "cardNumber"){
      let newV = [];
      [...e.target.value.replace(/\s/g, '')].map((digit, i) => {
        i % 4 == 0 ? newV.push(...[" ", digit]) : newV.push(digit)
      })
      e.target.value = newV.join('').trim()
    }
    setFormData(prevData => {
      return {...prevData, [e.target.name]: e.target.value}
    })
    setErrors(prevErrors => ({...prevErrors, [e.target.name]: null}))
  }

  function handleSubmit(e){
    e.preventDefault()
    setErrors({
      name: null,
      cardNumber : null,
      expM : null,
      expY : null,
      cvv : null
    })
    let isValid = true
    Object.keys(formData).forEach(key => {
      if(!formData[key]){
        setErrors(prevErrors => ({...prevErrors, [key]: "Can't be blank"}))
        isValid = false
      }
    })

    if(formData.cardNumber.length < 19){
      setErrors(prevErrors => ({...prevErrors, cardNumber: "Invalid card number"}))
      isValid = false
    }

    if(formData.cardNumber.replace(/\s/g, '').match(/\D/g)){
      setErrors(prevErrors => ({...prevErrors, cardNumber: "Wrong format, numbers only"}))
      isValid = false
    }
    if(formData.expM < 0 || formData.expM > 12 || formData.expM.replace(/\s/g, '').match(/\D/g)){
      setErrors(prevErrors => ({...prevErrors, expM: "Wrong month"}))
      isValid = false
    }


    if(formData.expY.replace(/\s/g, '').match(/\D/g) || formData.expY < (new Date().getUTCFullYear() % 1000)){
      setErrors(prevErrors => ({...prevErrors, expY: "Wrong year format"}))
      isValid = false
    }

    if(formData.expY < (new Date().getUTCFullYear() % 1000)){
      setErrors(prevErrors => ({...prevErrors, expY: "Expiration year can only be in the future"}))
      isValid = false
    }
    
    if(formData.expM-1 < (new Date().getUTCMonth()) && formData.expY <= (new Date().getUTCFullYear() % 1000)){
      setErrors(prevErrors => ({...prevErrors, expM: "Expiration date can only be in the future"}))
      isValid = false
    }

    if(formData.cvv.replace(/\s/g, '').match(/\D/g)){
      setErrors(prevErrors => ({...prevErrors, cvv: "Wrong format, numbers only"}))
      isValid = false
    }

    if(!isValid)
      return

    setIsSuccess(isValid)
    
  }

  return (
    <>
    <main>
      <div className='images-container'>
        <div className='front-img-container'>
          <img src='/images/bg-card-front.png' className='front-img' alt='Card front'></img>
          <div className='front-content'>
            <img src='/images/card-logo.svg' className='card-logo' alt='Card logo'></img>
            <div className='card-front-text'>
              <p className='img-card-number'>{formData.cardNumber != "" ? formData.cardNumber : "0000 0000 0000 0000"}</p>
              <div className='card-front-name-date'>
                <p className='img-card-name'>{formData.name != "" ? formData.name : "Jane Appleseed"}</p>
                <p className='img-card-exp-m'>{formData.expM != "" ? formData.expM : "00"}</p>/
                <p className='img-card-exp-y'>{formData.expY != "" ? formData.expY : "00"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='back-img-container'>
          <img src='/images/bg-card-back.png' className='back-img' alt='Card back'></img>
          <div className='back-content'>
            <p className='img-card-cvv'>{formData.cvv != "" ? formData.cvv : "000"}</p>
          </div>
        </div>
      </div>
      {isSuccess ? <Success /> : <form name='card-details-form' onSubmit={handleSubmit}>
        <div className='name-input-container'>
          <label htmlFor='name'>Cardholder name</label>
          <input 
            name='name' 
            type='text'
            className={errors.name ? "input-error" : ""}
            placeholder='e.g. Jane Appleseed'
            onChange={handleChange}
            value={formData.name}
          />
          {errors.name && <p className='error error-name'>{errors.name}</p>}
        </div>
        <div className='number-input-container'>
          <label htmlFor='cardNumber'>Card number</label>
          <input 
            name='cardNumber' 
            type='text' 
            className={errors.cardNumber ? "input-error" : ""}
            placeholder='e.g. 1234 5678 9123 0000'
            maxLength="19"
            onChange={handleChange}
            value={formData.cardNumber}
          />
          {errors.cardNumber && <p className='error error-cardNumber'>{errors.cardNumber}</p>}
        </div>

        <div className='date-cvv-input-container'>
          <div className='date-input-contaier'>
            <label htmlFor='exp-date'>Exp. date (MM/YY)</label>
            <div className='date-inputs'>
                <input 
                  name='expM' 
                  type='text' 
                  className={errors.expM ? "input-error" : ""}
                  placeholder='MM'
                  maxLength="2"
                  onChange={handleChange}
                  value={formData.expM}
                />
                <input 
                  name='expY' 
                  type='text' 
                  className={errors.expY ? "input-error" : ""}
                  placeholder='YY'
                  maxLength="2"
                  onChange={handleChange}
                  value={formData.expY}
                />
            </div>
            {errors.expM && <p className='error error-expM'>{errors.expM}</p>}
            {errors.expY && <p className='error error-expY'>{errors.expY}</p>}
          </div>
          <div className='cvv-input-contaier'>
            <label htmlFor='cvv'>CVC</label>
            <input 
              name='cvv' 
              type='text'
              className={errors.cvv ? "input-error" : ""}
              placeholder='e.g. 123'
              maxLength="4"
              onChange={handleChange}
              value={formData.cvv}
            />
            {errors.cvv && <p className='error error-cvv'>{errors.cvv}</p>}
          </div>
        </div>

        <button className='form-btn'>Confirm</button>
      </form>}
    </main>
    <footer className="attribution">
    Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
    Coded by <a href="https://github.com/aveandrian">aveandrian</a>.
  </footer>
    </>
  )
}

export default App
