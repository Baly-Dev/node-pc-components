//imports package
const fs = require('fs')
const url = require('url')
const http = require('http')

const port = 8080

const replaceTemplate = (template, component) => {
    let result = template.replace(/{%EMOJI%}/g, component.emoji)
    result = result.replace(/{%NAME%}/g, component.name)
    result = result.replace(/{%DESCRIPTION%}/g, component.description)
    result = result.replace(/{%PRICE%}/g, component.price)
    result = result.replace(/{%ID%}/g, component.id)
    return result
}

// data
const data = fs.readFileSync(`${__dirname}/data_store/api.json`)
const components = JSON.parse(data)

// templates
const globalTemp = fs.readFileSync(`${__dirname}/templates/global.html`, 'utf-8')
const headerTemp = fs.readFileSync(`${__dirname}/templates/header.html`, 'utf-8')
let mainTemp = fs.readFileSync(`${__dirname}/templates/main.html`, 'utf-8')
const footerTemp  = fs.readFileSync(`${__dirname}/templates/footer.html`, 'utf-8')
const componentTemp = fs.readFileSync(`${__dirname}/templates/component.html`, 'utf-8')
const detailComponentTemp = fs.readFileSync(`${__dirname}/templates/component-detail.html`, 'utf-8')

//server
const server = http.createServer((req, res) => {
    const pathName = req.url
    const urlObj = url.parse(pathName, true)

    // home
    if (pathName === '/' || pathName == '/home'){
        res.writeHead(200, {'Content-type':'text/html'})

        const componentsHtml = components.map(el => replaceTemplate(componentTemp, el)).join('')
        mainTemp = mainTemp.replace('{%COMPONENTS%}', componentsHtml)

        const output = globalTemp.replace('{%TEMPLATE%}', `${headerTemp} ${mainTemp} ${footerTemp}`)
        res.end(output)
    }

    // components detail
    else if(pathName === `/component?id=${urlObj.query.id}`){
        res.writeHead(200, {'Content-type':'text/html'})

        const component = components[urlObj.query.id]
        const detailComponent = replaceTemplate(detailComponentTemp, component)

        const output = globalTemp.replace('{%TEMPLATE%}', `${headerTemp} ${detailComponent} ${footerTemp}`)
        res.end(output)
    }

     // 404
    else{
        res.writeHead(200, {'Content-type':'text/html'})
        res.end('<h1>404 Not found</h1>')
    }
})

server.listen(port, 'localhost', () => {
    console.log('Listening at the port ' + port + '...')
}) 