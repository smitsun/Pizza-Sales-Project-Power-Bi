use pizza_db


select * from pizza_sales


select distinct pizza_category from pizza_sales














select top 5 pizza_name, sum(total_price) Total_Revenue from pizza_sales
group by pizza_name
order by Total_Revenue


select top 5 pizza_name, sum(total_price) Total_Revenue from pizza_sales
group by pizza_name
order by Total_Revenue desc





select pizza_size, cast(sum(total_price) as decimal (10,2)) as Total_Sales, cast(sum(total_price) * 100 /
(select sum(total_price) from pizza_sales where  datepart(QUARTER, order_date)='1' ) as decimal(10,2))as PCT
from pizza_sales 
where  datepart(QUARTER, order_date)='1'
group by pizza_size
order by pct desc





select pizza_category, sum(total_price) as Total_Sales, sum(total_price) * 100 /
(select sum(total_price) from pizza_sales where month(order_date)= 1) as PCT
from pizza_sales 
where month(order_date)= 1
group by pizza_category



















