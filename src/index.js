const express = require('express');
const ObjectId = require('mongodb').ObjectID;
const ejs = require('ejs');
const ejsLayout = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const bcrypt = require('bcrypt');

const DbConnecter = require('./libs/DbConnecter.js');
const UserHelper = require('./libs/UserHelper.js');

const app = express();

app.set('views', './templates');
app.set('layout', './layouts/app.ejs');
app.set('view engine', 'ejs');

app.use(ejsLayout);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(busboyBodyParser());
app.use(bodyParser.json());


app.get('/', async (req, res) => {
	const db = await DbConnecter.connect();
	const users = await db.collection('users').find({}).limit(3).toArray();

	UserHelper.ucFirstUsers(users);

	res.render('homepage', {title: 'Accueil', users: users});
});

app.get('/manage', async (req, res) => {
	const db = await DbConnecter.connect();
	const users = await db.collection('users').find({}).toArray();

	UserHelper.ucFirstUsers(users);

	res.render('dashboard', {title: 'Gestion', users: users});
});

app.post('/add-user', async (req, res) => {

	const db = await DbConnecter.connect();
	db.collection('users').insertOne({
		pseudo: req.body.pseudo,
		kind: req.body.kind,
		first_name: req.body.firstName,
		last_name: req.body.lastName,
		mail: req.body.mail,
		password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
	}).then(result => {
		res.redirect('/manage');
	}, error => {
		res.json({'error': 'not inserted'});
	});
});

app.post('/delete-user', async (req, res) => {
	const db = await DbConnecter.connect();
	db.collection('users').deleteOne({
		"_id": ObjectId(req.body.id)
	}).then(result => {
		res.redirect('/manage');
	}, error => {
		res.json({'error': 'not deleted'});
	});
});

app.get('/diagram', async (req, res) => {
	// modules charts etc ...
	res.render('diagram', {title: 'Graphs'});
});


app.listen(80, () => console.log('Web dev services on air : port 80'));

// @gadax 2022