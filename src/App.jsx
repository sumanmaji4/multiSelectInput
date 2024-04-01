import { useEffect, useRef, useState } from 'react'
import './App.css'
import Pile from './Pile'

const url = 'https://dummyjson.com/users/search?q='

function App() {
  const [searchValue, setSerachValue] = useState('')
  const [options, setOptions] = useState([])
  const [userSet, changeUserSet] = useState(new Set())
  const [finalSelection, setFinalSelection] = useState([])

  const inputRef = useRef()

  function handledChange(e) {
    setSerachValue(e.target.value)
  }

  useEffect(() => {
    async function fetchData() {
      if (searchValue.trim() === '') return
      let res = await fetch(`${url}${searchValue}`)
      res = await res.json()
      setOptions([...res.users])
    }

    fetchData()
  }, [searchValue])

  // console.log(options)
  function selectUser(user) {
    setFinalSelection([...finalSelection, user])
    setSerachValue('')
    setOptions([])
    changeUserSet(new Set([...userSet, user.email]))
    inputRef.current.focus()
  }

  function removeUser(user) {
    // console.log(user)
    const filteredFinalSelection = finalSelection.filter(
      (curr_user) => curr_user !== user
    )
    setFinalSelection(filteredFinalSelection)
    // const filteredUserSet = userSet.delete(user.email) //can't delete directly
    const updatedSet = new Set(userSet)
    updatedSet.delete(user.email)
    changeUserSet(new Set([...updatedSet]))
  }
  // console.log(userSet)

  function handledKeyDown(e) {
    // console.log(inputRef?.current?.value)
    if (inputRef?.current?.value === '' && e.key === 'Backspace') {
      let last = finalSelection.length
      if (last) {
        removeUser(finalSelection[last - 1])
      }
    }
  }

  return (
    <div className='containter'>
      <div className='input-box'>
        {finalSelection.length > 0 &&
          finalSelection.map((user) => (
            <Pile user={user} removeUser={removeUser} key={user.email} />
          ))}
        <input
          ref={inputRef}
          value={searchValue}
          onChange={(e) => handledChange(e)}
          placeholder='Enter name or mail'
          onKeyDown={handledKeyDown}
        />
        {options.length > 0 && (
          <ul>
            {options.map(
              (user, idx) =>
                !userSet.has(user.email) && (
                  <li
                    key={`${user.email}${idx}`}
                    onClick={() => selectUser(user)}
                  >
                    <img src={user.image} className='user-image' />
                    <span>{user.firstName}</span>
                    <span>{user.lastName}</span>
                  </li>
                )
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
