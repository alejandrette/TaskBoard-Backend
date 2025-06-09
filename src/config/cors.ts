import { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
  origin: function(origin, callback) {
    const whiteList = [process.env.FRONT_URL || 'http://localhost:5173']

    if (!origin || whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Error CORS'))
    }
  }
}