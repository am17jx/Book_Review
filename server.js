require('dotenv').config();
const app = require('./app');

const port = process.env.PORT
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });