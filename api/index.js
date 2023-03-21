const axios = require("axios")
const domain = "http://nqapp.nurulquran.com"
const fs = require("fs")

const getAudioListFromAllPages = async (page = 1) => {
  const query = `${domain}/index.php/api/songView?page=${page}`
  const response = await axios.get(query)
  const data = response.data
  
  console.log(data)

  if (data.allpage > page) {
    return data.data.concat(await getAudioListFromAllPages(page + 1))
  } else {
	console.log(data.data)
    return data.data
  }
}

getAudioListFromAllPages().then(data => {
  const text = "export const json = " + JSON.stringify(data)
  fs.writeFile("output.js", text, (err) => {
    if (err) console.log(err)
    else console.log("Data written successfully")
  })
})

