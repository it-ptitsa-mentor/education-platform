// @ts-check

import React, { useState } from 'react'
import axios from 'axios'

// BEGIN (write your solution here)
const Autocomplete = () => {
  const [term, setTerm] = useState('')
  const [countries, setCountries] = useState([])

  const handleChange = async (e) => {
    const text = e.target.value
    setTerm(text)
    if (text.length === 0) {
      setCountries([])
    }

    try {
      const res = await axios.get('/countries', { params: { term: text } })
      setCountries(res.data)
      return
    } catch (error) {
      console.error(error)
    }

    setTerm('')
    setCountries([])
    return
  }

  return (
    <div>
      <form>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Country"
          value={term}
          onChange={handleChange}
        />
      </form>
      {term.length > 0 && countries.length > 0 && (
        <ul>
          {countries.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Autocomplete
// END
