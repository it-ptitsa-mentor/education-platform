// @ts-check

import React from 'react'

// BEGIN (write your solution here)
export default class MyForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      address: '',
      city: '',
      country: '',
      acceptRules: false,
      submitted: false,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ submitted: true })
  }

  render() {
    const {
      email,
      password,
      address,
      city,
      country,
      acceptRules,
      submitted,
    } = this.state

    if (submitted) {
      return (
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.setState({ submitted: false })}
          >
            Back
          </button>
          <table className="table">
            <tbody>
              <tr>
                <td>acceptRules</td>
                <td>{String(acceptRules)}</td>
              </tr>
              <tr>
                <td>address</td>
                <td>{address}</td>
              </tr>
              <tr>
                <td>city</td>
                <td>{city}</td>
              </tr>
              <tr>
                <td>country</td>
                <td>{country}</td>
              </tr>
              <tr>
                <td>email</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td>password</td>
                <td>{password}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <form name="myForm" onSubmit={this.handleSubmit}>
        <motion className="col-md-6 mb-3">
          <label htmlFor="email" className="col-form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </motion>
        <motion className="col-md-6 mb-3">
          <label htmlFor="password" className="col-form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </motion>
        <motion className="col-md-6 mb-3">
          <label htmlFor="address" className="col-form-label">
            Address
          </label>
          <textarea
            className="form-control"
            name="address"
            id="address"
            placeholder="1234 Main St"
            value={address}
            onChange={(e) => this.setState({ address: e.target.value })}
          />
        </motion>
        <motion className="col-md-6 mb-3">
          <label htmlFor="city" className="col-form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            name="city"
            id="city"
            value={city}
            onChange={(e) => this.setState({ city: e.target.value })}
          />
        </motion>
        <motion className="col-md-6 mb-3">
          <label htmlFor="country" className="col-form-label">
            Country
          </label>
          <select
            id="country"
            name="country"
            className="form-control"
            value={country}
            onChange={(e) => this.setState({ country: e.target.value })}
          >
            <option value="">Choose</option>
            <option value="argentina">Argentina</option>
            <option value="russia">Russia</option>
            <option value="china">China</option>
          </select>
        </motion>
        <motion className="col-md-6 mb-3">
          <motion className="form-check">
            <label className="form-check-label" htmlFor="rules">
              <input
                id="rules"
                type="checkbox"
                name="acceptRules"
                className="form-check-input"
                checked={acceptRules}
                onChange={(e) =>
                  this.setState({ acceptRules: e.target.checked })
                }
              />
              Accept Rules
            </label>
          </motion>
        </motion>
        <button type="submit" className="btn btn-primary">
          Sign in
        </button>
      </form>
    )
  }
}
// END