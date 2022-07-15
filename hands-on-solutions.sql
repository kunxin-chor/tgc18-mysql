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

-- q7
select customerName, country, sum(amount) from payments
join customers on payments.customerNumber = customers.customerNumber
where country = "USA"
group by customerName, country

-- grouping by customerNumber ensures no issues when there are two customers with the same name
select payments.customerNumber, customerName, sum(amount) from payments join customers
	on payments.customerNumber = customers.customerNumber
group by payments.customerNumber, customerName

-- q8
select state, count(*) AS "employee_count" from employees
join offices on employees.officeCode = offices.officeCode
where country = "USA"
group by state 

-- q9
select avg(amount), customerName from customers join payments
	on customers.customerNumber = payments.customerNumber
group by payments.customerNumber, customerName

-- q10
select avg(amount), customerName from customers join payments
	on customers.customerNumber = payments.customerNumber
group by payments.customerNumber, customerName
having sum(amount) >= 10000

-- q11
select orderdetails.productCode, productName, count(*) FROM
	orderdetails join products on orderdetails.productCode = products.productCode
group by orderdetails.productCode, productName
order by count(*) DESC
limit 10;

-- alternatively:
select orderdetails.productCode, productName, count(*) as "times_ordered" FROM
	orderdetails join products on orderdetails.productCode = products.productCode
group by orderdetails.productCode, productName
order by times_ordered DESC
limit 10;