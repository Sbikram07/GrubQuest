const mongoose = require("mongoose")

const ConnectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log(`Database connection Successfull.`)
  } catch (error) {
    console.error("Database connection failed:", error.message)
    process.exit(1)
  }
}

module.exports = ConnectToDB
