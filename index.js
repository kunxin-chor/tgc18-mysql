const express = require('express')
const hbs = require('hbs');
const wax = require('wax-on');
const mysql2 = require('mysql2/promise');  // to use await/async, we must
                                          // use the promise version o f mysql2


const app = express();
app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')


async function main() {
    const connection = await mysql2.createConnection({
        'host': 'localhost',  // host -> ip address of the database server
        'user': 'ahkow',
        'database': 'sakila',
        'password': 'rotiprata123'
    })
  
    app.get('/actors', async function(req,res){
        // connection.execute returns an array of results
        // the first element is the table that we selected
        // the second element onwards are some housekeeping data
        // the first element will be stored in actors variable
        const [actors] = await connection.execute("SELECT * FROM actor");

        // short form for:
        // const results = await connection.execute("SELECT * FROM actor");
        // const actors = results[0];
        
        res.render('actors.hbs',{
            'actors': actors
        })
    })

    app.get('/staff', async function (req,res){
        const [staff] = await connection.execute('SELECT staff_id, first_name, last_name, email from staff');
        res.render('staff',{
            'staff': staff
        })
    })
}
main();

// enable using forms
app.use(express.urlencoded({
    'extended': false
}))

app.listen(3000, function(){
    console.log("server has started")
})