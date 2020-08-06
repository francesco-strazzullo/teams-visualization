import React, { useState, useEffect } from 'react'
import teams from '../lib/teams'
import BubbleChart from './BubbleChart'

const getSurferlist = data => data.reduce((acc, t) => {
  t.surfers.forEach(surfer => {
    const existingUser = acc.find(u => u.label === surfer.nickname)
    if (existingUser) {
      existingUser.value++
    } else {
      acc.push({
        label: surfer.nickname,
        value: 1,
        payload: {
          id: surfer.id,
          image: surfer.image
        }
      })
    }
  })
  return acc
}, [])
  .sort((a, b) => {
    return a.label.localeCompare(b.label)
  })

const getTeamsList = data => data
  .map(t => {
    return {
      label: t.name,
      value: t.surfers.length
    }
  })
  .sort((a, b) => {
    return a.label.localeCompare(b.label)
  })

export default () => {
  const [data, setTeams] = useState([])
  const [type, setType] = useState('PEOPLE')

  useEffect(() => {
    (async () => {
      const list = await teams.list()
      setTeams(list)
    })()
  }, [])

  const parsedData = type === 'PEOPLE' ? getSurferlist(data) : getTeamsList(data)

  return (
    <div>
      <button onClick={() => setType('TEAMS')}>Teams</button>
      <button onClick={() => setType('PEOPLE')}>Surfers</button>
      <BubbleChart
        showLegend={false}
        data={parsedData}
      />
    </div>
  )
}
