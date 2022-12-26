const fs = require('fs');
const express = require('express')
const expresslayout = require('express-ejs-layouts')
const morgan = require('morgan');
const app = express()
const port = 3500

const {saveContact, loadContact, detailContact, deleteContact, checkDuplicateName, updateContact} = require('./contacts');

const { body, validationResult, check } = require('express-validator')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')


// using ejs 
app.set('view engine', 'ejs')
app.use(expresslayout) // one of thrid-party middleware


// build-in middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


// config flash
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)
app.use(flash())


// application middleware
app.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next();
})

app.use((req, res, next) => {
  console.log('Time2: ', Date.now())
  next();
})
// application middleware (end)

app.get('/', (req, res) => {
  res.render('index', { layout: 'layouts/app-layout', name: 'anton effendi'})
})

app.get('/contact', (req, res) => {
  const contacts = loadContact();

  res.render('contact', { layout: 'layouts/app-layout', contacts, msg: req.flash('msg') })
})

// save contact
app.post('/contact', [
  body('name').custom((value) => {
    const duplicate = checkDuplicateName(value)
    if (duplicate){
      throw new Error('Name already exits')
    }
    return true
  }),
  check('email', 'Email is not valid').isEmail(),
  body('hp', 'Hp is not valid').isMobilePhone('id-ID')
  ], 
  (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()){
      res.render('contact_new', { layout: 'layouts/app-layout', errors: errors.array() })
    } else {
      saveContact(req.body)
      req.flash('msg', 'Contact has been successfully saved')
      res.redirect('/contact')
    }
  }
)

// update contact
app.post('/contact/update', [
  body('name').custom((value, { req }) => {
    const duplicate = checkDuplicateName(value)
    if (value !== req.body.oldName && duplicate){
      throw new Error('Name already exits')
    }
    return true
  }),
  check('email', 'Email is not valid').isEmail(),
  body('hp', 'Hp is not valid').isMobilePhone('id-ID')
  ], 
  (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()){
      res.render('contact_edit', { layout: 'layouts/app-layout', errors: errors.array(), contact: req.body })
    } else {
      // res.send(req.body)
      updateContact(req.body.oldName, req.body)
      req.flash('msg', 'Contact has been successfully updated')
      res.redirect('/contact')
    }
  }
)



// delete contact
app.get('/contact/delete/:name', (req, res) => {
  const contact = detailContact(req.params.name)
  if (!contact) {
    res.status = 404 
    res.send('<h1> not found - 404 </h1>')
  } else {
    deleteContact(contact.name)
    req.flash('msg', 'contact has been successfully deleted')
    res.redirect('/contact')
  }

})

// edit contact
app.get('/contact/edit/:name', (req, res) => {
  const contact = detailContact(req.params.name);

  res.render('contact_edit', { layout: 'layouts/app-layout', contact })
})

// add contact
app.get('/contact/new', (req, res) => {
  const contacts = loadContact();

  res.render('contact_new', { layout: 'layouts/app-layout', contacts })
})

app.get('/detail/:name', (req, res) => {
  const contact = detailContact(req.params.name);

  res.render('detail_contact', { layout: 'layouts/app-layout', contact })
})

app.get('/about-youduan', (req, res) => {
  res.render('about-youduan', { layout: 'layouts/app-layout' })
})

app.get('/about', (req, res) => {
  res.sendFile('./about.html', { root: `${__dirname}/views` })
})

app.get('/test_param/:id', (req, res) => {
  res.send(`testing params ${req.params.id }`)
})

app.get('/test_json/', (req, res) => {
  // const a = {test: 1, test: 2}
  res.json({test: 1, test1: 2})
})

app.use('/', (req, res) => {
  res.status = 404
  res.send('<h1>404</h1>')

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
