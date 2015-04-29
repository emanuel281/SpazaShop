exports.show_popular_products = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT stock_item, SUM(no_sold) AS no_sold FROM sales_history GROUP BY stock_item ORDER BY no_sold DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'popular_products', {
    			data : results
    		});
      });
	});
};

exports.show_popular_category = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT cat_name, SUM(no_sold) AS no_sold FROM sales_history INNER JOIN categories ON cat_id=categories.id GROUP BY cat_name ORDER BY no_sold DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'popular_categories', {
    			data : results
    		});
      });
	});
};

exports.show_products_price_cost = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT stock_item, sales_price, cost FROM sales_history INNER JOIN purchase_history ON stock_item=purchase_history.item GROUP BY stock_item', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'products_price_cost', {
    			data : results
    		});
      });
	});
};

exports.show_product_earnings = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT stock_item, SUM(cast(substring(sales_price,2) as decimal(53,8))*no_sold) AS earnings FROM sales_history GROUP BY stock_item ORDER BY earnings DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'product_earnings', {
    			data : results
    		});
      });
	});
};

exports.show_product_profits = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT stock_item, avg_profit*no_sold AS profits FROM (SELECT stock_item, ROUND(SUM(profit)/SUM(1), 2) as avg_profit FROM (SELECT * FROM (SELECT stock_item, CAST(SUBSTRING(sales_price,2) AS DECIMAL(53,2)) AS price,CAST(SUBSTRING(cost, 2) AS DECIMAL(53,2)) AS cost, (CAST(SUBSTRING(sales_price,2) AS DECIMAL(53,2)) - CAST(SUBSTRING(cost, 2) AS DECIMAL(53,2))) AS profit FROM sales_history INNER JOIN purchase_history ON stock_item=item GROUP BY stock_item, price, cost) AS single_profits) AS single_profits GROUP BY stock_item) AS avg_prod_profits INNER JOIN product_sold ON product_name=stock_item ORDER BY profits DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'product_profits', {
    			data : results
    		});
      });
	});
};

exports.show_supplier_popular_product = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT product_name, shop from product_sold INNER JOIN purchase_history ON item=product_name WHERE no_sold=(SELECT MAX(no_sold) FROM product_sold) GROUP BY product_name', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'supplier_popular_product', {
    			data : results
    		});
      });
	});
};


exports.show_supplier_profitable_product = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT MAX(profits), shop, stock_item FROM (SELECT shop, stock_item, (CAST(SUBSTRING(sales_price,2) AS DECIMAL(53,2))-CAST(SUBSTRING(cost, 2) AS DECIMAL(53,2)))*product_sold.no_sold AS profits FROM sales_history INNER JOIN purchase_history ON stock_item=item INNER JOIN product_sold ON product_name=item GROUP BY sales_history.stock_item ORDER BY profits DESC) AS prod_profits', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'supplier_profitable_product', {
    			data : results
    		});
      });
	});
};

exports.show_sales_per_day = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT day, SUM(no_sold)/SUM(CASE WHEN no_sold > 0 THEN 1 ELSE 0 END) as avg_per_weekday from  (SELECT DISTINCT day, date, SUM(no_sold) as no_sold FROM sales_history GROUP BY date) AS sales_per_date GROUP BY day ORDER BY avg_per_weekday DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'sales_per_day', {
    			data : results
    		});
      });
	});
};

exports.show_stock_rates = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT item, CAST((quantity-no_sold)/quantity*100 AS DECIMAL(10,2)) AS rate_as_percent FROM (SELECT item, SUM(quantity) as quantity FROM purchase_history GROUP BY item) as entire_stock INNER JOIN product_sold ON product_name=item ORDER BY rate_as_percent', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'stock_rates', {
    			data : results
    		});
      });
	});
};

exports.show_regular_sales = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT stock_item, SUM(CASE WHEN no_sold > 0 THEN 1 ELSE 0 END) AS frequency FROM sales_history GROUP BY stock_item ORDER by frequency DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'regular_sales', {
    			data : results
    		});
      });
	});
};

exports.show_entire_stock = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT item, SUM(quantity) as quantity FROM purchase_history GROUP BY item ORDER BY quantity DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'entire_stock', {
    			data : results
    		});
      });
	});
};

exports.show_daily_profits = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT DISTINCT day, ROUND(SUM(profits)/SUM(1), 2) AS profits FROM (SELECT DISTINCT sales_history.date, day, SUM((CAST(SUBSTRING(sales_price,2) AS DECIMAL(53,2))-CAST(SUBSTRING(cost, 2) AS DECIMAL(53,2)))*no_sold) AS profits  FROM sales_history INNER JOIN purchase_history ON item=stock_item GROUP BY date) AS date_profits GROUP BY day ORDER BY profits DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'daily_profits', {
    			data : results
    		});
      });
	});
};

exports.show_category_profits = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT cat_name, SUM(avg_profit*product_sold.no_sold) AS profits FROM (SELECT cat_id,stock_item, ROUND(SUM(profit)/SUM(1), 2) as avg_profit FROM (SELECT * FROM (SELECT cat_id, stock_item, CAST(SUBSTRING(sales_price,2) AS DECIMAL(53,2)) AS price,CAST(SUBSTRING(cost, 2) AS DECIMAL(53,2)) AS cost, (CAST(SUBSTRING(sales_price,2) AS DECIMAL(53,2)) - CAST(SUBSTRING(cost, 2) AS DECIMAL(53,2) )) AS profit FROM sales_history INNER JOIN purchase_history ON stock_item=item GROUP BY stock_item, price, cost) AS single_profits) AS single_profits GROUP BY stock_item)AS avg_prod_profits INNER JOIN product_sold ON product_name=stock_item INNER JOIN categories ON categories.id=cat_id GROUP BY cat_name ORDER BY profits DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'category_profits', {
    			data : results
    		});
      });
	});
};

exports.show_category_sales_per_day_per_week = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT cat_name, CASE WHEN (SUM(no_sold)/SUM(1)) < ROUND(SUM(no_sold)/SUM(1), 0) THEN ROUND(SUM(no_sold)/SUM(1), 0) ELSE ROUND(SUM(no_sold)/SUM(1),0)+1 END AS per_day, CASE WHEN (SUM(no_sold)/7) < ROUND((SUM(no_sold)/SUM(1))/7, 0) THEN ROUND(SUM(no_sold)/7, 0) ELSE ROUND(SUM(no_sold)/7,0)+1 END AS per_week FROM (SELECT date, cat_id, cat_name, SUM(no_sold) AS no_sold FROM sales_history INNER JOIN categories ON categories.id=cat_id GROUP BY date, cat_name) AS cat_sales GROUP BY cat_name ORDER BY per_day, per_week', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'category_sales_per_day_per_week', {
    			data : results
    		});
      });
	});
};

exports.show_category_earnings = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT cat_name, SUM(earnings) AS earnings FROM (SELECT cat_name, no_sold*ROUND(AVG(price), 2) AS earnings FROM (SELECT cat_name, stock_item, price, SUM(no_sold) AS no_sold  FROM (SELECT cat_id, stock_item, CAST(SUBSTRING(sales_price,2) AS DECIMAL(53,2)) AS price, no_sold FROM sales_history) AS prod_price INNER JOIN categories ON cat_id=categories.id GROUP BY stock_item, price) AS product_price GROUP BY stock_item, price) AS cat_earnings GROUP BY cat_name ORDER BY earnings DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'category_earnings', {
    			data : results
    		});
      });
	});
};

exports.show_products_per_day_per_week = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT stock_item, CASE WHEN (SUM(no_sold)/SUM(1)) < ROUND(SUM(no_sold)/SUM(1), 0) THEN ROUND(SUM(no_sold)/SUM(1), 0) ELSE ROUND(SUM(no_sold)/SUM(1),0)+1 END AS per_day, CASE WHEN (SUM(no_sold)/7) < ROUND((SUM(no_sold)/SUM(1))/7, 0) THEN ROUND(SUM(no_sold)/7, 0) ELSE ROUND(SUM(no_sold)/7,0)+1 END AS per_week FROM (SELECT date, stock_item, SUM(no_sold) AS no_sold FROM sales_history GROUP BY date, stock_item) AS prod_sales GROUP BY stock_item ORDER BY per_day DESC, per_week DESC', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'products_per_day_per_week', {
    			data : results
    		});
      });
	});
};

exports.show_all_suppliers = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT DISTINCT shop FROM purchase_history', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'all_suppliers', {
    			data : results
    		});
      });
	});
};

exports.show_sales_history = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT * FROM sales_history', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'sales_history', {
    			data : results
    		});
      });
	});
};

exports.show_purchase_history = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT * FROM purchase_history', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'purchase_history', {
    			data : results
    		});
      });
	});
};

exports.show_product_sold = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT * FROM product_sold', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'product_sold', {
    			data : results
    		});
      });
	});
};

exports.show_categories = function(req, res, next){
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT * FROM categories', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'categories', {
    			data : results
    		});
      });
	});
};

exports.get_sales_history = function(req, res, next){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM sales_history WHERE id = ?', [id], function(err,rows){
			if(err){
    				console.log("Error Selecting : %s ",err );
			}
			res.render('edit_sales_history',{page_title:"Edit Product", data : rows[0]});      
		}); 
	});
};

exports.update_sales_history = function(req, res, next){

	var data = JSON.parse(JSON.stringify(req.body));
    	var id = req.params.id;
    	req.getConnection(function(err, connection){
    		connection.query('UPDATE sales_history SET ? WHERE id = ?', [data, id], function(err, rows){
    			if (err){
              			console.log("Error Updating : %s ",err );
    			}
          		res.redirect('/sales_history');
    		});
    		
    });
};

exports.get_categories = function(req, res, next){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM categories WHERE id = ?', [id], function(err,rows){
			if(err){
    				console.log("Error Selecting : %s ",err );
			}
			res.render('edit_categories',{page_title:"Edit Categories", data : rows[0]});      
		}); 
	});
};

exports.update_categories = function(req, res, next){

	var data = JSON.parse(JSON.stringify(req.body));
    	var id = req.params.id;
    	req.getConnection(function(err, connection){
    		connection.query('UPDATE categories SET ? WHERE id = ?', [data, id], function(err, rows){
    			if (err){
              			console.log("Error Updating : %s ",err );
    			}
          		res.redirect('/categories');
    		});
    		
    });
};

exports.get_product_sold = function(req, res, next){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM product_sold WHERE id = ?', [id], function(err,rows){
			if(err){
    				console.log("Error Selecting : %s ",err );
			}
			res.render('edit_product_sold',{page_title:"Edit Product Sold", data : rows[0]});      
		}); 
	});
};

exports.update_product_sold = function(req, res, next){

	var data = JSON.parse(JSON.stringify(req.body));
    	var id = req.params.id;
    	req.getConnection(function(err, connection){
    		connection.query('UPDATE product_sold SET ? WHERE id = ?', [data, id], function(err, rows){
    			if (err){
              			console.log("Error Updating : %s ",err );
    			}
          		res.redirect('/product_sold');
    		});
    		
    });
};

exports.get_purchase_history = function(req, res, next){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM purchase_history WHERE id = ?', [id], function(err,rows){
			if(err){
    				console.log("Error Selecting : %s ",err );
			}
			res.render('edit_purchase_history',{page_title:"Edit Purchase History", data : rows[0]});      
		}); 
	});
};

exports.update_purchase_history = function(req, res, next){

	var data = JSON.parse(JSON.stringify(req.body));
    	var id = req.params.id;
    	req.getConnection(function(err, connection){
    		connection.query('UPDATE purchase_history SET ? WHERE id = ?', [data, id], function(err, rows){
    			if (err){
              			console.log("Error Updating : %s ",err );
    			}
          		res.redirect('/purchase_history');
    		});
    		
    });
};

exports.add_sales_history = function (req, res, next) {
    req.getConnection(function(err, connection){
        if (err){ 
            return next(err);
        }
        
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
                    day : input.day,
                    date : input.date,
                    stock_item : input.stock_item,
                    no_sold : input.no_sold,
                    sales_price : input.sales_price
            };
        connection.query('insert into sales_history set ?', data, function(err, results) {
                if (err)
                        console.log("Error inserting : %s ",err );
         
                res.redirect('/sales_history');
            });
    });
};