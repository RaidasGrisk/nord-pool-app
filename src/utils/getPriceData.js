
  export const getPriceData = async (date) => {

    console.log('getting data, for date: ', date)

    const formattedDate = date.split('-').reverse().join('-')
    const corsProxy = 'https://cors-anywhere.herokuapp.com/'
    // const corsProxy = 'https://proxy.cors.sh/'
    const url = `https://www.nordpoolgroup.com/api/marketdata/page/10?endDate=${formattedDate}`
    const response = await fetch(corsProxy + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const reponse_ = await response.json()

    let data = reponse_

    // filter out rows with data for Min, Max, etc.
    const namesToFilterOut = ['Min', 'Max', 'Average', 'Peak', 'Off-peak 1', 'Off-peak 2']
    data = data.data.Rows.filter(row => !namesToFilterOut.includes(row.Name))

    // filter out LTU data only
    data = data.map(row => (
      {
        value: parseFloat(row.Columns.filter(col => col.Name == 'LT')[0].Value.replace(',', '.')),
        date: new Date(row.StartTime).getHours(),
      }
    ))

    return data
  }
