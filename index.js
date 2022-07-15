const express = require('express')
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const mysql2 = require('mysql2/promise');  // to use await/async, we must
                                          // use the promise version of mysql2



const app = express();
app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')


async function main() {
    const connection = await mysql2.createConnection({
        'host': process.env.DB_HOST,  // host -> ip address of the database server
        'user': process.env.DB_USER,
        'database': process.env.DB_DATABASE,
        'password': process.env.DB_PASSWORD
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

    app.get('/search', async function(req,res){

        // define the 'get all results query'
        let query = "SELECT * from actor WHERE 1";
        let bindings = []


        // if req.query.first_name is not falsely
        // remember -- undefined, null, empty string, 0 ==> falsely
        if (req.query.first_name) {
            query += ` AND first_name LIKE ?`
            bindings.push('%' + req.query.first_name + '%')
        }

        // if the last name is provided, then add it as part of the search
        if (req.query.last_name) {
            query += ` AND last_name LIKE ?`;
            bindings.push('%' + req.query.last_name + '%')
        }

        console.log(query, bindings);
        let [actors] = await connection.execute(query, bindings);

        res.render('search',{
            'actors':actors
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