
  export const getPriceData = async (date) => {

    const url = 'https://nord-pool-app-backend-xncgijgjyq-uc.a.run.app/'
    const url_ = url + `price_data?date=${date}`
    const response = await fetch(url_, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const reponse_ = await response.json()
    return reponse_
  }
