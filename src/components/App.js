import React, { useState, useEffect } from 'react'
import teams from '../lib/teams'
import BubbleChart from './BubbleChart'

export default () => {
  const [data, setTeams] = useState([])
  useEffect(() => {
    (async () => {
      const list = await teams.list()
      setTeams(list)
    })()
  }, [])

  const teamList = data
    .map(t => {
      return {
        label: t.name,
        value: t.surfers.length
      }
    })
    .sort((a, b) => {
      return a.label.localeCompare(b.label)
    })

  const userList = data.reduce((acc, t) => {
    t.surfers.forEach(surfer => {
      const existingUser = acc.find(u => u.label === surfer.name)
      if (existingUser) {
        existingUser.value++
      } else {
        acc.push({
          label: surfer.name,
          value: 1
        })
      }
    })
    return acc
  }, [])
    .sort((a, b) => {
      return a.label.localeCompare(b.label)
    })

  return (
    <div>
      <BubbleChart
        width={1000}
        height={800}
        data={teamList}
      />
      <BubbleChart
        width={1000}
        height={800}
        data={userList}
      />
    </div>
  )
}
