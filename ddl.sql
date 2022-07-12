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

# create the departments table
create table departments (
    department_id int unsigned auto_increment primary key,
    name varchar(100)
) engine = innodb;

# add a new column to an existing table
alter table employees add column name varchar(100);
ALTER TABLE employees RENAME COLUMN name TO first_name;

# insert two or three departments
insert into departments (name) values ("Accounting"),("Human Resources"), ("IT");

# insert an employee with first name
insert into employees (
    first_name, email, gender, notes, employment_date, designation
) values ('Tan Ah Kow', 'asd@asd.com', 'm', 'Newbie', curdate(), "Intern");

# delete existing employee (so that we can add in the foregin key)
delete from employees;

# add a fk between employees and departments
# step 1: add the column
alter table employees add column department_id int unsigned not null;
# step 2: indicate the newly added column to be a FK
alter table employees add constraint fk_employees_departments
    foreign key (department_id) references departments(department_id);

insert into employees (first_name, department_id, email, gender, notes, employment_date, designation) 
    VALUES ("Tan Ah Kow", 3, "ahkow@asd.com", 'm', 'Newbie', curdate(), 'Intern');