import React from 'react'
import TeamsChart from './TeamsChart'
import { useHistory } from 'react-router'

export default (props) => {
  const history = useHistory()

  const goTo = label => history.push(`/teams/${label}`)

  return <TeamsChart {...props} bubbleClickFun={goTo} />
}
