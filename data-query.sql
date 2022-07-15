-- display all columns from all rows
select * from employees;   -- The * refers to all the columns

-- select <column names> from <table name>
-- display the firstname, lastname and email column from all the employees
select firstName, lastName, email from employees;

-- select column and rename them
SELECT firstName AS 'First Name', lastName AS 'Last Name', email AS 'Email' FROM employees;

-- use where to filter the rows
select * from employees where officeCode = 1;

-- show the city, addressline1, addressline2 of all offices in the USA
select city, addressLine1, addressLine2 from offices where country = "USA";

-- use LIKE with wildcard to match partial strings

-- %sales% will match as long as the word 'sales' appear anywhere in jobtitle
SELECT * FROM employees WHERE jobTitle LIKE "%sales%"

-- %sales will match as long as the job title ends with 'sales'
SELECT * FROM employees WHERE jobTitle LIKE "%sales";

-- sales% will match as long as the jobtitle begins with 'sales
SELECT * FROM employees WHERE jobTitle LIKE "sales%";

-- find all the products which name begins with 1969
select productName from products where productName like '1969%';

-- find all the products which name contains the string 'Davidson'
select productName from products where productName like '%Davidson%'

-- filter for multiple conditions using logical operators
-- find all sales rep from office code 1
SELECT * FROM employees WHERE officeCode = "1" 
	AND jobTitle LIKE "Sales Rep";

-- find all employees from office code 1 or office code 2
select * from employees where officeCode = 1 or officeCode = 2;

-- show all sales rep from office code 1 or office code 2
-- OR has lower priority than AND
select * from employees where jobTitle LIKE "Sales Rep" and
(officeCode = 1 OR officecode = 2);

-- show all the customers from the USA in the state NV
-- who has credit limit more than 5000 OR all customers from any country 
-- which creditLimit > 1000
select * from customers where (country = "USA"
   and state="NV" 
   and creditLimit > 5000) or creditLimit > 10000

select firstName, lastName, city, addressLine1, addressLine2 from employees join offices on employees.officeCode = offices.officeCode
 where country = "USA"

 -- show the customerName along with the firstName, lastName and email of their sales rep
 -- only for customers that have a sales rep
select customerName, salesRepEmployeeNumber, firstName, lastName, email
from customers join employees
on customers.salesRepEmployeeNumber = employees.employeeNumber

--show all customers with their sales rep info, regardless of
--whether the customers have a sales repo or not
-- show the customerName along with the firstName, lastName and email of their sales rep
select customerName, firstName, lastName, email
from customers left join employees
on customers.salesRepEmployeeNumber = employees.employeeNumber

-- show the customerName along with the firstName, lastName and email of their sales rep
-- will show for all employeess regardless of whether they have customers
-- (customers with no sales rep won't show up)
select customerName, firstName, lastName, email
from customers right join employees
on customers.salesRepEmployeeNumber = employees.employeeNumber

-- full outer join == left join + right join

-- for each customer in the USA, show the name of the sales rep and their office number
select customerName AS "Customer Name", customers.country as "Customer Country", firstName, lastName, offices.phone from customers JOIN employees
  ON customers.salesRepEmployeeNumber = employees.employeeNumber
  JOIN offices ON employees.officeCode = offices.officeCode
  WHERE customers.country = "USA";
  
-- Date manipulation

-- tell you the current date on server
SELECT curdate();

-- the date and time
select now();

-- Show all payments made after 30th June 2003 
SELECT * FROM payments WHERE paymentDate > "2003-06-30"

-- show all payments between 2003-01-01 and 2003-06-30
SELECT * FROM payments WHERE paymentDate >= "2003-01-01" AND
  paymentDate <= "2003-06-30"

SELECT * FROM payments where paymentDate BETWEEN "2003-01-01" AND "2003-06-30";

-- display the year where a payment is made:
select checkNumber, YEAR(paymentDate) FROM payments

-- show all payments made in the year 2003:
select checkNumber, YEAR(paymentDate) FROM payments WHERE YEAR(paymentDate) = 2003;

-- display the month, year and day for each payment made
select checkNumber, YEAR(paymentDate), MONTH(paymentDate), DAY(paymentDate) FROM payments