# Data Definition Language

# create a database
create database employees;


# show databases
show databases;

# before we can issue commands for a database
# we must set the current active database
use employees;

select database();

# create a new table
create table employees (
    employee_id int unsigned auto_increment primary key,
    email varchar(320),
    gender varchar(1),
    notes text,
    employment_date date,
    designation varchar(100)
) engine = innodb;

# show the columns in a table
describe employees;

# delete a table
drop table employees;

# inserting rows
insert into employees (
    email, gender, notes, employment_date, designation
) values ('asd@asd.com', 'm', 'Newbie', curdate(), "Intern");

# see all the rows in a table
select * from employees;

# update one row in a table
update employees set email="asd@gmail.com" where employee_id = 1;

# delete one row
delete from employees where employee_id=1;