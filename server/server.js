const app = require("./app");
require("dotenv").config();
const ConnectToDB=require("./src/config/db")
const PORT = process.env.PORT || 5000;

ConnectToDB()
app.listen(PORT, () => {
  console.log(`server is now running on the port:${PORT}`);
});
