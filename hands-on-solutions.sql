-- q1
select city, phone, country from offices;

-- q2
select * from orders where comments like '%fedex%';

-- q3
select contactFirstName, contactLastName from customers
order by (customerName) desc

-- q4
select * from employees where (officeCode = 1
OR officeCode = 2
OR officeCode = 3)
AND (firstName LIKE '%son%' OR lastName like '%son%')
AND jobTitle = "Sales Rep";

-- q5
select * from orders join customers
ON orders.customerNumber = customers.customerNumber
join orderdetails ON orders.orderNumber = orderdetails.orderNumber
where customers.customerNumber = 124;

-- q6
select productName, 
 orderNumber,
 orderdetails.productCode,
 quantityOrdered,
 orderLineNumber 
from 
 products join orderdetails 
   on products.productCode = orderdetails.productCode;

## AGGREGATE FUNCTIONS

-- count how many rows there are in employees table
select count(*) from employees;

-- sum: add up the value of a specific column across all the rows
SELECT sum(quantityOrdered) from orderdetails

-- you could filter the rows, or join the table, before using aggregate functions
SELECT sum(quantityOrdered) FROM orderdetails
	WHERE productCode = "S18_1749"

SELECT sum(quantityOrdered * priceEach) FROM orderdetails
	WHERE productCode = "S18_1749"

SELECT sum(quantityOrdered * priceEach) AS "Total Worth Ordered" FROM orderdetails
	WHERE productCode = "S18_1749"

-- count how many customers there are with sales reps
select count(*) from customers join employees
on customers.salesRepEmployeeNumber = employees.employeeNumber

-- find the total amount paid by customers in the month of June 2003
select sum(amount) from payments where paymentDate between '2003-06-01' AND '2003-06-30'

-- alternative: find the total amount paid by customers in the month of June 2003
select sum(amount) from payments where month(paymentDate) = 6 and year(paymentDate) = 2003s


