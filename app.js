var express = require("express")
var exphbs = require("express-handlebars")

    mysql = require('mysql'), 
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    products = require('./routes/products'),
    categories = require('./routes/products'),
    purchase_history = require('./routes/products'),
    suppliers = require('./routes/products');

var app = express();

var dbOptions = {
      host: 'localhost',
      user: 'Nelisa',
      password: 'password',
      port: 3306,
      database: 'nelisa_products'
};



app.engine("handlebars", exphbs({defaultLayout:"main"}))
app.set("view engine", "handlebars")

app.use("/static", express.static("views"))
app.use("/static", express.static("."))

//setup middleware
app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//setup the handlers
app.get('/products', products.show);
app.get('/categories', categories.show_cat);
app.get('/purchase_history', purchase_history.show_purchase_hist);
app.get('/suppliers', suppliers.show_sup);
//app.get('/products/edit/:id', products.get);
//app.post('/products/update/:id', products.update);
//app.post('/products/add', products.add);
//this should be a post but this is only an illustration of CRUD - not on good practices
//app.get('/products/delete/:id', products.delete);

app.get("/", function(req, res){
	res.render("home")
})
/**app.get("/category_earnings", function(req, res){
	var data = require("./category_earnings.json")

	res.render("category_earnings", {data:data})
})

app.get("/category_sales_per_day_per_week", function(req, res){
	var data = require("./category_per_day_per_week.json")

	res.render("category_sales_per_day_per_week", {data:data})
})

app.get("/category_profits", function(req, res){
	var data = require("./category_profits.json")

	res.render("category_profits", {data:data})
})

app.get("/daily_profits", function(req, res){
	var data = require("./daily_profits.json")

	res.render("daily_profits", {data:data})
})

app.get("/entire_stock", function(req, res){
	var data = require("./entire_stock.json")

	res.render("entire_stock", {data:data})
})

app.get("/regular_sales", function(req, res){
	var data = require("./most_regular_sales.json")

	res.render("regular_sales", {data:data})
})

app.get("/popular_categories", function(req, res){
	var data = require("./popular_categories.json")

	res.render("popular_categories", {data:data})
})

app.get("/popular_products", function(req, res){
	var data = require("./popular_products.json")

	res.render("popular_products", {data:data})
})

app.get("/products_price_cost", function(req, res){
	var data = require("./price_and_cost.json")

	res.render("products_price_cost", {data:data})
})

app.get("/product_earnings", function(req, res){
	var data = require("./product_earnings.json")

	res.render("product_earnings", {data:data})
})

app.get("/products_per_day_per_week", function(req, res){
	var data = require("./product_per_day_per_week.json")

	res.render("products_per_day_per_week", {data:data})
})

app.get("/product_profits", function(req, res){
	var data = require("./product_profits.json")

	res.render("product_profits", {data:data})
})

app.get("/sales_per_day", function(req, res){
	var data = require("./sales_per_day.json")

	res.render("sales_per_day", {data:data})
})

app.get("/stock_rates", function(req, res){
	var data = require("./stock_rates.json")

	res.render("stock_rates", {data:data})
})

app.get("/supplier_popular_product", function(req, res){
	var data = require("./supplier_pop.json")

	res.render("supplier_popular_product", {data:data})
})

app.get("/supplier_profitable_product", function(req, res){
	var data = require("./supplier_profitable.json")

	res.render("supplier_profitable_product", {data:data})
})**/

var server = app.listen(3000, function(){

	console.log("server is running on " + server.address().address + ":" +server.address().port)

})