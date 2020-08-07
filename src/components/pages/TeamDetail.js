import React from 'react'
import { useParams } from 'react-router'
import TeamsDetailChart from './TeamsDetailChart'

export default (props) => {
  const { team } = useParams()
  return (
    <div>
      <h2>{team}</h2>
      <TeamsDetailChart {...props} team={team} />
    </div>
  )
}
