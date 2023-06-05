require('dotenv').config({ path: '../.env' })
const { TINYURL_TOKEN } = process.env
const axios = require('axios')
const long_url ='https://articulo.mercadolibre.com.pe/MPE-618667239-airpods-pro-2da-generacion-2022-_JM?variation=175385104327#reco_item_pos=1&reco_backend=machinalis-homes&reco_backend_type=function&reco_client=home_navigation-recommendations&reco_id=8ab76da0-4d62-469f-81b4-891cc0a656cf&c_id=/home/navigation-recommendations/element&c_element_order=2&c_uid=6c07c84f-8c38-4f6b-99a2-5d8d6f46dd9c'

async function urlShorten(url) {
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


urlShorten(long_url)
  .then((response) => {
    const shortUrl = response
    console.log('Shortened URL:', shortUrl)
  })
  .catch((error) => {
    console.error('Error shortening URL:', error)
  })