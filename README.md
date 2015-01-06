## Node.js-MongoDb-Express.js-Heroku Boilerplate

This is boilerplate code for setting up a simple node.js app using: the express.js framework, a MongoDb database (with the help of Mongoose), simple front-end templating with hogan-express (based on mustache templating), and hosting it on Heroku. Please refer to the following documentation for each of these components:

* Node.js: <http://nodejs.org/>
* Express.js: <http://expressjs.com/>
* Moongoose.js (for MongoDB interaction): <http://mongoosejs.com/>
* Hogan-Express (for front-end templating): <https://github.com/vol4ok/hogan-express> and <http://mustache.github.io/mustache.5.html>
* Heroku: <https://devcenter.heroku.com/categories/support> 

### Getting started with your local development server

**Dependenices:**

1) Download node.js if you have not already <http://nodejs.org/>. You can confirm that node is successfully installed on your machine by opening up Terminal and typing 'node'. If you don't get an error, it's installed! You can exit the node process with Ctrl+c.

2) Download and install the Heroku Toolbelt <https://toolbelt.heroku.com>, this will give you Foreman and the Heroku CLI (command line interface).

3) Set up an account at <https://heroku.com>. You will be asked to enter a credit card, but the app we are doing will not incur any charges (they just need a card on file). In fact, all Heroku apps have a starter/free level.

4) Download this boilerplate repo and navigate into the code directory with Terminal:

cd path/to/this/code/directory

5) Run **npm install** to get all required libraries.

	npm install

6) We now need to setup a Git repository and Heroku app.

	git init
	git add .
	git commit -am "init commit"

7) Create the Heroku app

	heroku create

NOTE: if it is your very **FIRST** time setting up a Heroku app, you will need to upload a public key to Heroku. See <http://stackoverflow.com/a/6059231>. As explained in that StackOverlow link, if you don't yet have a public key, you'll be prompted to add one.

8) Now that your heroku app is set-up, you can rename it whenever you like (now or in the future):

	heroku rename your-new-name

Your app will now be available at your-app-name.herokuapp.com

You can always open your app with the command:

	heroku open

### Setting Up Your MongoDB database

Heroku has many nice add-ons that make it easier to set-up an app. For example, the MongoLabs add-on gives you a MongoDB database with a single line of code.

9) Add MongoLabs Starter MongoDB to your heroku app:

	heroku addons:add mongolab

If you log-in to your heroku dashboard at <https://heroku.com>, you'll now see this as an add-on. Click on the 'MongoLab' link to see your database.

10) Get the Heroku MongoLab connection string into an .env file

	heroku config --shell | grep MONGOLAB_URI >> .env

Your connection string to MongoDB will now be in a **.env** file now (go have a look at the .env file). Your app connects to this database in the app.js file:

	app.db = mongoose.connect(process.env.MONGOLAB_URI);

Your **.env file** is a secret config file that holds key app variables like this MongoDB URI string, and other things like 3rd Party API secrets and keys. It is specified in the .gitignore file, which means the .env file will **not** be tracked by .git and not available for others to see on github (this is good).

11) We're ready to go! Start server with **foreman start**.

	foreman start

Foreman reads your .env file, populates the process.env object for use in your app.

12) Open web browser to <http://localhost:5000> to view the web app.

13) Stop the web server press Ctrl+c in the Terminal window.

### Push Your App to Github and Heroku

As you make changes, you'll want to periodically push your updated code base to both Github and to Heroku (where it is publicly hosted).

To get your updated code to **Heroku**, you'll need to:

	git add .
	git commit -am "your commit message"
	git push heroku master

To get your updated code to **Github**, you'll need to:

(first, create a new repo; then, once a repo is created and you have changes to push):

	git add .
	git commit -am "your commit message"
	git push origin master

You don't need to double add and double commit though. So the following will work:

	git add .
	git commit -am "your commit message"
	git push origin master
	git push heroku master

### Auto restart development server (optional)

To auto restart your development server after you make some changes to your code. Install **Nodemon**. [Nodemon](https://github.com/remy/nodemon) will watch your files and restart the server for you.

Install Nodemon. In Terminal type,

	npm install -g nodemon

There are two possible ways to use Nodemon. You can start the app with:

	foreman run nodemon app.js

Or with the helper script:

	. devserver

The **.nodemonignore** file will ignore certain files and directories from being watched. By default and for example we're ignoring /public folder.


### This App's Framework and NodeJS

This app uses the following libraries and concepts:

#### ExpressJS

ExpressJS (http://expressjs.com/) is a popular framework for building web applications in NodeJS.

#### Routing

Routing is how you direct the user's requested URL to retrieve the appropriate 'page' or save the submitted form. All routes execute functions, the callbacks should receive a request and response object from Express:

	app.get('/hello',function(request, response){
	    // when the user requests the /hello page, this function is called
	    // your code goes here
	})

#### HTTP Methods

GET - a user requests a web page or resource (in this case, '/bio')

	app.get('/bio',function(request, response){
	    console.log("GET request for /bio");
	    response.send("This is the bio page.");
	});

More likely, you'll be serving up an html page like:

	app.get('/bio',function(request, response){
	    console.log("GET request for /");
	    response.render("bio.html");
	});

POST- a user submits a form

	app.post("/form-submission", function(request, response){
	    
	    console.log("a user has submitted data to /form-submission via POST");
	    
	    //you can see the submitted data with
	    console.log(request.body);

	    //can now process that data
	    
	    //send message back to user
	    response.send("okay, we'll process that right away.")

	    // or you could redirect them back to the home page
	    // response.redirect('/');

	    // or you could render html
	    // response.render('thanks.html');
	});


-----

#### Template Engine - Hogan-Express

[Hogan Express](https://github.com/vol4ok/hogan-express)

We are using Hogan-Express, a templating engine, to render our html on ExpressJS. Hogan-Express templates are mainly HTML and include {{variablehere}} template tags to display dynamic data and perform simple logic and looping. It is based on the popular mustache templating language: <http://mustache.github.io/mustache.5.html>

You will save these html templates to a specific directory and then tell ExpressJS about that directory, which we'll call **/views**. We configure Express to use Hogan-Express template engine and set the template directory **/views** with these statements.

We configure ExpressJS to use Hogan-Express in two files

package.json
	
	...
	"dependencies": {
	    "express": "^4.10.7",
	    "hogan-express": "^0.5.2"
  	},
  	...

app.js

	...

	//  templates directory
	app.set('views', __dirname + '/views');

	// setup template engine - we're using Hogan-Express
	// https://github.com/vol4ok/hogan-express
	app.set('view engine', 'html');
	app.set('layout','layout');
	app.engine('html', require('hogan-express'));

	...

Now, all yout html templates can go in the **/views** folder, and Express will know where to look for them.

#### Rendering templates w/ data

We define our incoming routes in app.js like mentioned above. Now, we need to tell our app what to do when a certain route is called. We will create an **index.js** file in a folder called **/routes** to do that.

app.js

	var routes = require('../routes/index.js'); // route logic is in this file
	app.get('/page1', routes.getPage1);

Here we are telling our app that, when /page1 is requested, call the function **getPage1** in the index.js file.

/routes/index.js (example, not the same as actual code in routes/index.js)

	exports.getPage1 = function(req, res) {

		var templateData = {
			'title' : 'Hello This is Page 1',
			'content' : 'We are on page 1',
			'tags' : ['hello','world','example!']
		}

		// we can pass in this templateData, which will be available within the page1.html template

		res.render('page1.html', templateData);
	}

This would look as follows in the html template:

/views/page1.html

	<h1>{{title}}</h1>
	<hr>
	<p>
		{{content}}
	</p>
	<br>
	Tagged:
	{{#tags}}
	<li>{{.}}</li>
	{{/tags}}

/view/layout.html

Layouts allow you to have a standard header and footer for a set of pages. It is automatically enabled for this demo code to use /views/layout.html

	<html>
		<head>
		<!-- meta and css stuff here -->
		</head>
		<body>
			{{{ yield }}}
		</body>
	</html>

Each unique template is placed within the yield tag.