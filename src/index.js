import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});

console.log("PORT from .env:", process.env.PORT);

connectDB()
  .then(() => {
    try {
      const server = app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT || 8000}`);
      });

      // Handle unexpected errors in the server
      server.on("error", (err) => {
        console.error("Server error:", err);
        process.exit(1); // Exit the process on server failure
      });
    } catch (err) {
      console.error("Error while starting the server:", err);
      process.exit(1); // Gracefully exit in case of failure
    }
  })
  .catch((err) => {
    console.log("MongoDb connection Failed", err);
  });

// (using  IIFE)
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//   } catch (error) {
//     console.log("Error", error);
//     throw error;
//   }
// })();
