const express = require('express')
const hbs = require('hbs');
const wax = require('wax-on');
require('handlebars-helpers')({
    'handlebars': hbs.handlebars
})
require('dotenv').config();
const mysql2 = require('mysql2/promise');  // to use await/async, we must
// use the promise version of mysql2



const app = express();
app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

app.use(express.urlencoded({
    'extended': false
}));


async function main() {
    const connection = await mysql2.createConnection({
        'host': process.env.DB_HOST,  // host -> ip address of the database server
        'user': process.env.DB_USER,
        'database': process.env.DB_DATABASE,
        'password': process.env.DB_PASSWORD
    })

    app.get('/error', async function (req, res) {
        res.status(500);
        res.send("Something went wrong");
    })

    app.get('/actors', async function (req, res) {
        // connection.execute returns an array of results
        // the first element is the table that we selected
        // the second element onwards are some housekeeping data
        // the first element will be stored in actors variable
        const [actors] = await connection.execute("SELECT * FROM actor");

        // short form for:
        // const results = await connection.execute("SELECT * FROM actor");
        // const actors = results[0];

        res.render('actors.hbs', {
            'actors': actors
        })
    })

    app.get('/staff', async function (req, res) {
        const [staff] = await connection.execute('SELECT staff_id, first_name, last_name, email from staff');
        res.render('staff', {
            'staff': staff
        })
    })

    app.get('/search', async function (req, res) {

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
        let [actors] = await connection.execute(query, bindings);

        res.render('search', {
            'actors': actors
        })

    })

    app.get('/actors/create', async function (req, res) {
        res.render('create_actor');
    })

    app.post('/actors/create', async function (req, res) {
        const query = "insert into actor (first_name, last_name) values (?, ?)";
        const bindings = [req.body.first_name, req.body.last_name];
        await connection.execute(query, bindings);
        res.redirect('/actors');
    })

    app.get('/actors/:actor_id/update', async function (req, res) {
        const actorId = parseInt(req.params.actor_id);
        const query = "select * from actor where actor_id = ?";
        const [actors] = await connection.execute(query, [actorId]);
        const actorToUpdate = actors[0]; // since we are only expecting one result,we just take the first index
        res.render('update_actor', {
            'actor': actorToUpdate
        })
    })

    app.post('/actors/:actor_id/update', async function (req, res) {

        if (req.body.first_name.length > 45 || req.body.last_name > 45) {
            res.status(400);
            res.send("Invalid request");
            return;
        }

        // sample query
        // update actor set first_name="Zoe2", last_name="Tay2" WHERE actor_id = 202;
        const query = `update actor set first_name=?, last_name=? WHERE actor_id = ?`
        const bindings = [req.body.first_name, req.body.last_name, parseInt(req.params.actor_id)];
        await connection.execute(query, bindings);
        res.redirect('/actors');
    })

    app.post('/actors/:actor_id/delete', async function (req, res) {
        const query = "DELETE FROM actor WHERE actor_id = ?";
        const bindings = [parseInt(req.params.actor_id)]
        await connection.execute(query, bindings);
        res.redirect('/actors');
    })

    app.get('/categories', async function (req, res) {
        const query = "SELECT * FROM category ORDER BY name";
        const [categories] = await connection.execute(query);
        res.render('categories', {
            'categories': categories
        })
    })

    app.get('/categories/create', async function (req, res) {
        res.render('create_category')
    })

    app.post('/categories/create', async function (req, res) {
        let categoryName = req.body.name;
        if (categoryName.length <= 25) {
            const query = `INSERT INTO category (name) value (?)`
            await connection.execute(query, [categoryName]);
            res.redirect('/categories');
        } else {
            res.status(400);
            res.send("Invalid request");
        }
    })

    app.get('/categories/:category_id/update', async function (req, res) {
        // retrieve the category that we want to update
        const query = "SELECT * from category where category_id = ?";
        const bindings = [parseInt(req.params.category_id)];
        try {
            const [categories] = await connection.execute(query, bindings);
            const category = categories[0];
            res.render('update_category', {
                'category': category
            })
        } catch (e) {

        }
    })

    app.post('/categories/:category_id/update', async function (req, res) {
        try {
            const query = `UPDATE category SET name=? WHERE category_id = ?`;
            const bindings = [req.body.name, parseInt(req.params.category_id)]
            await connection.execute(query, bindings);
            res.redirect('/categories');
        } catch (e) {
            console.log(e);
            res.redirect('/error')
        }

    })

    app.get('/categories/:category_id/delete', async function (req, res) {
        const query = "SELECT * from category where category_id = ?"
        const [categories] = await connection.execute(query, [parseInt(req.params.category_id)]);
        const categoryToDelete = categories[0];
        res.render('confirm_delete_category', {
            'category': categoryToDelete
        })
    })

    app.post('/categories/:category_id/delete', async function (req, res) {

        // find all the films which have category_id equal to the one that we are trying to delete
        const deleteQuery = "DELETE FROM film_category where category_id = ?";
        await connection.execute(deleteQuery, [parseInt(req.params.category_id)]);

        const query = "DELETE FROM category where category_id = ?";
        const bindings = [parseInt(req.params.category_id)];
        await connection.execute(query, bindings);
        res.redirect('/categories');
    })

    app.get('/films/create', async function (req, res) {
        const [languages] = await connection.execute(
            "SELECT * FROM language"
        );

        const [actors] = await connection.execute(
            "SELECT * FROM actor"
        );

        res.render('create_film', {
            languages: languages,
            actors: actors
        })
    })

    app.get('/films', async function (req, res) {
        const [films] = await connection.execute(`SELECT film_id, title, description, language.name AS 'language' FROM film 
                                                  JOIN language 
                                                  ON film.language_id = language.language_id`);


        res.render('films', {
            films: films
        })
    })

    app.post('/films/create', async function (req, res) {

        let actors = req.body.actors ? req.body.actors : [];
        actors = Array.isArray(actors) ? actors : [actors];

        // nested ternary expression
        // let actors = req.body.actors ? 
        //     (Array.isArray(req.body.actors) ? req.body.actors : [req.body.actors]) 
        //     : [];
        /*
        insert into film (title, description, language_id)
               values ("The Lord of the Ring", "blah blah blah", 1);
        */

        // 1. we have to create the row first
        const [results] = await connection.execute(
            `insert into film (title, description, language_id) values (?, ?, ?)`,
            [req.body.title, req.body.description, parseInt(req.body.language_id),]
        );

        const newFilmId = results.insertId;

        // 2. then add in the relationship in the pivot table
        // sample query:
        /*
         insert into film_actor  (actor_id, film_id) values (2, 1002)
        */
        for (let actorId of actors) {
            const bindings = [actorId, newFilmId];
            await connection.execute(`insert into film_actor (actor_id, film_id) values (?, ?)`, bindings);
        }

        res.redirect('/films');
    })

    app.get('/films/:film_id/update', async function (req, res) {
        const [languages] = await connection.execute("SELECT * from language");
        const [films] = await connection.execute("SELECT * from film where film_id = ?",
            [parseInt(req.params.film_id)]);
        const [actors] = await connection.execute("SELECT * from actor");
        const [currentActors] = await connection.execute("SELECT actor_id from film_actor where film_id =?", [req.params.film_id]);
        const currentActorIds = currentActors.map( a => a.actor_id);
        console.log(currentActorIds)
        const filmToUpdate = films[0];

        res.render('update_film', {
            'film': filmToUpdate,
            'languages': languages,
            'actors': actors,
            'currentActors': currentActorIds
        })

    })

    app.post('/films/:film_id/update', async function (req, res) {
        /* sample query:
         update film set title="ASD ASD",
                 description="ASD2 ASD2",
                 language_id=3
                WHERE film_id=1;
        */
       // always update the row first
        await connection.execute(
            `UPDATE film SET title=?,
                         description=?,
                         language_id=?
                         WHERE film_id=?`,
            [req.body.title, req.body.description, parseInt(req.body.language_id), req.params.film_id]
        );

        // update the M:M relationship
        // update actors
        // first remove all the actors from the film
        await connection.execute("DELETE FROM film_actor WHERE film_id = ?", [req.params.film_id]);

        // second re-add all the selected actors back to the film
        let actors = req.body.actors ? req.body.actors : [];
        actors = Array.isArray(actors) ? actors : [actors];
        for (let actorId of actors) {
            await connection.execute("INSERT INTO film_actor (film_id, actor_id) VALUES (?, ?)", [
                parseInt(req.params.film_id),
                actorId
            ])
        }

        res.redirect('/films');
    })
}
main();

// enable using forms
app.use(express.urlencoded({
    'extended': false
}))

app.listen(3000, function () {
    console.log("server has started")
})