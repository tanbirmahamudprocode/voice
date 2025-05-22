require('dotenv').config()
require('./src/config/db')
const app = require('./src/app')



const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
