import React, { useState, useEffect } from 'react'
import teams from '../lib/teams'
import BubbleChart from './BubbleChart'
import TeamsChart from './TeamsChart'

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
  const [taam, setTeam] = useState()
  const [loading, setLoading] = useState(true)
  const [data, setTeams] = useState([])
  const [type, setType] = useState('TEAMS')

  const switchType = type => () => {
    setType(type)
  }

  useEffect(() => {
    (async () => {
      const list = await teams.list()
      setTeams(list)
      setLoading(false)
    })()
  }, [])

  console.log(taam)

  if (loading) {
    return <img src='https://files-ks6o2epzy.vercel.app/' />
  }

  const parsedData = type === 'PEOPLE' ? getSurferlist(data) : getTeamsList(data)

  const chart = type === 'PEOPLE' ? (
    <BubbleChart
      showLegend={false}
      data={parsedData}
    />
  ) : (
    <TeamsChart
      bubbleClickFun={setTeam}
      data={data}
    />
  )

  return (
    <div>
      <button onClick={switchType('TEAMS')}>Teams</button>
      <button onClick={switchType('PEOPLE')}>Surfers</button>
      {chart}
    </div>
  )
}
