import React from 'react'

// BEGIN (write your solution here)
export default class DefinitionsList extends React.Component {

  render() {
    const { data } = this.props
    return (
      data.length === 0 ? null :
        <dl>
          {data.map(it =>
          (
            <React.Fragment key={it.id}>
              <dt>{it.dt}</dt>
              <dd>{it.dd}</dd>
            </React.Fragment>
          )
          )}
        </dl>
    )
  }
}
// END
