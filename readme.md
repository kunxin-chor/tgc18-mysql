To start mysql, in the terminal, type in `mysql -u root`


# Import the sakila database
```
mysql -u root < sakila-schema.sql
mysql -u root < sakila-data.sql
```

# Dependencies
Create a file with the name `init.sh`

```
yarn add express
yarn add hbs
yarn add wax-on
yarn add handlebars-helpers
yarn add mysql2
```

Set permission:
```
chmod +x init.sh
```

# Create User
The root is the 'superadmin' user. So it's dangerous to use it. So for every
project we will create a database user. 

```
CREATE USER 'ahkow'@'localhost' IDENTIFIED BY 'rotiprata123';
GRANT ALL PRIVILEGES  on sakila.* TO 'ahkow'@'localhost' WITH GRANT OPTION;
```
