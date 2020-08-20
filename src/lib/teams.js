const fetch = require('node-fetch')
const { token } = require('./config.json')

const list = async () => {
  const headers = new fetch.Headers({
    Authorization: token
  })

  const data = await fetch('https://secret-harbor-63385.herokuapp.com/teams', {
    method: 'GET',
    headers,
    mode: 'cors'
  }).then(r => r.json())

  return data.filter(t => t.active)
}

const getPeople = teamName => {
  return list().then(teams => {
    const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase())
    if (!team) {
      return []
    }

    return team.surfers
  })
}

export default {
  getPeople,
  list
}
