import connectDB from "./src/config/db.config.js"
import app from "./src/app.js";

connectDB()
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  })
})
.catch((err) => {
  console.error("Failed to start the server: ", err)
})