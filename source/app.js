//Core modules
const path = require('path')

//NPM modules
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname, '../templates/partials')

//Setting up the view engine we'll use
//hbs uses behind scene the handlebars module
//Setting the views path and the partials one
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicPath))

//Home or index page
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Marco Jones'
    }) //name of the index.hbs template
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Marco Jones'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'Need some help? Ask Google!',
        name: 'Marco Jones'
    })
})

// req = request
// res = response
app.get('/weather', (req,res) => {

    const queryAddress = req.query.address
    if ( !queryAddress ) {
        return res.send({
            error: 'Address shall be provided'
        })
    }

    geocode( queryAddress, (error, data = {}) => {
        if ( error ) {
            return res.send(error)
        }
        forecast( data.longitude, data.latitude, (error, forecastData) => {
            if (error) {
                return res.send(error)
            }
            res.send({
                forecast: forecastData,
                location: data.location,
                address: queryAddress
            })
        })
    })
})

app.get('/products', (req, res) => {
    if ( !req.query.search ) {
        return res.send({
            error: 'You must prive a search term'
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })    
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Marco Jones',
        errorMessage: 'Help article not found'
    })
})

//* means match anything that has not been matched before
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Marco Jones',
        errorMessage: 'Page not found!'
    })
})

//UNCOMMENT WHEN RUNNING LOCALY
// //Start up the server on the port 3000
// //passing a callback function which does what
// //is being told there when the server is up
// app.listen(3000, () => {
//     console.log('Server running on port 3000')
// })

app.listen( port, () => {
    console.log('Server is up on port ' + port)
})