import { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
  origin: function(origin, callback){
    const whiteList = [process.env.FRONT_URL]

    if(whiteList.includes(origin)){
      callback(null, true)
    } else {
      callback(new Error('Error Cors'))
    }
  }
}