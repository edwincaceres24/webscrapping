require('dotenv').config()
const { TINYURL_TOKEN } = process.env
const axios = require('axios')
const longUrl = 'https://www.microsoft.com/es-pe/'

async function shortenUrl(url) {
  const apiUrl = 'https://api.tinyurl.com/create'

  const requestData = {
    url: url,
    domain: 'tinyurl.com',
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TINYURL_TOKEN}`,
    accept: 'application/json',
  }

  const response = await axios.post(apiUrl, requestData, { headers })

  return response
}

exports.shortenUrl = shortenUrl