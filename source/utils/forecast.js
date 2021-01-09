const request = require('request') // NPM library

//Weatherstack
const forecast = (longitude, latitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=9fefdd9e18a0662024788764b96b1e13&query=' + latitude +',' + longitude + '&units=m'
    request({ url, json:true }, (error, response) => {
        if ( error ) {
            callback( 'Unable to connect to the weather service!', undefined)
        } else if ( response.body.error ) {
            callback('Unable to find location, ' + response.body.error.info, undefined)
        } else {
            const current = response.body.current;
            const message = 'Current weather is ' + current.weather_descriptions[0] + 
                '. It is ' + current.temperature + 'ºC out with ' + current.precip + '% chance of rain'
            callback( undefined, message )
        }
    })
}

module.exports = forecast