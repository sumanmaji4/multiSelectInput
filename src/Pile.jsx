import React from 'react'

import './App.css'

function Pile({ user, removeUser }) {
  return (
    <span className='pile' onClick={() => removeUser(user)}>
      <span>{user.firstName}</span>
      <span>{user.lastName}</span>
      <span>&#x2718;</span>
    </span>
  )
}

export default Pile
