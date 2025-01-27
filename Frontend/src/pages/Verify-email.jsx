
import React from 'react'
import '../css/Verify-email.css'

function VerifyEmail() {
  return (
    <div className='main-container'>
      <form>
        <h1>Verify-email</h1>
        <label>OTP</label>
        <input type="text" placeholder="Enter your OTP" />
        <button type="submit">Submit</button>

      </form>
    
    </div>
  )
}

export default VerifyEmail