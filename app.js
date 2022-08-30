const express = require('express')
const customRouter = require('./customRouter');
const fs = require('fs');

const app = express();
const port = 3001;

var myLogger = function (_req, _res, next) {
  console.log('LOGGED: ');
  next();
}

// Usings

app.use(express.json());  // parse request body as JSON
app.use(express.static('public'));
app.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
  next();
  
});
app.use(myLogger);
app.use('/static', express.static('public')); // use prefix '/static' in the request
app.use('/customRouter', customRouter);

// ID generator

function generateID(){
  return Math.random().toString(36).slice(2);
}

// Validations

function validateClient(client){
  if(!client.name){
    console.log('Name field is mandatory');
    return false;
  }
  else if(!client.surname){
    console.log('Surname field is mandatory');
    return false;
  }
  else if(!client.email){
    console.log('Email field is mandatory');
    return false;
  }
  else{
    return true;
  }
}

function validateAppointment(appointment){
  if(!appointment.clientId){
    console.log('Client id field is mandatory');
    return false;
  }
  else if(!appointment.date){
    console.log('Date field is mandatory');
    return false;
  }
  else{
    return true;
  }
}

// Client APIs

app.get('/clients', (_req, res) => {
  fs.readFile('./db.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(jsonString);
      res.send(data.clients);
    }
  })
});

app.post('/saveClient', (req, res) => {
  if(!validateClient(req.body)){
    res.send('Client not added');
    return;
  }
  fs.readFile('./db.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(jsonString);
      const listOfClients = data.clients;
      const newClient = {"id": generateID(), ...req.body};
      listOfClients.push(newClient);
      fs.writeFile('./db.json', JSON.stringify(data), (err) => {
        if (err) throw err;
      })
      res.send('New client added');
    }
  })
});

app.delete('/client', (req, res) => {
  const query = req.query;
  fs.readFile('./db.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(jsonString);
      const listOfClients = data.clients;      
      const filteredClients = listOfClients.filter((c) => c.id !== query.id);
      data.clients = filteredClients;
      fs.writeFile('./db.json', JSON.stringify(data), (err) => {
        if (err) throw err;
      })
      res.send('Client deleted');
    }
  })
});

app.put('/editClient', (req, res) => {
  const updatedClient= req.body;
  fs.readFile('./db.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(jsonString);
      const listOfClients = data.clients;
      const clientIndex = listOfClients.findIndex(c => c.id == updatedClient.id);
      listOfClients[clientIndex] = updatedClient;
      fs.writeFile('./db.json', JSON.stringify(data), (err) => {
        if (err) throw err;
      })
      res.send('Client updated');
    }
  })
});

// Appointment APIs

app.get('/appointments', (_req, res) => {
  fs.readFile('./db.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(jsonString);
      res.send(data.appointments);
    }
  })
});

app.post('/saveAppointment', (req, res) => {
  if(!validateAppointment(req.body)){
    res.send('Appointment not added')
    return;
  }
  fs.readFile('./db.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(jsonString);
      const listOfAppointments = data.appointments;
      const newAppointment = {"id": generateID(), ...req.body};
      listOfAppointments.push(newAppointment);
      fs.writeFile('./db.json', JSON.stringify(data), (err) => {
        if (err) throw err;
      })
      res.send('New appointment added');
    }
  })
});

app.delete('/appointment', (req, res) => {
  const query = req.query;
  fs.readFile('./db.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(jsonString);
      const listOfAppointments = data.appointments;      
      const filteredAppointments = listOfAppointments.filter((a) => a.id !== query.id);
      data.appointments = filteredAppointments;
      fs.writeFile('./db.json', JSON.stringify(data), (err) => {
        if (err) throw err;
      })
      res.send('Appointment deleted');
    }
  })
});

app.put('/editAppointment', (req, res) => {``
  const updatedAppointment= req.body;
  fs.readFile('./db.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(jsonString);
      const listOfAppointments = data.appointments;
      const appointmenttIndex = listOfAppointments.findIndex(a => a.id == updatedAppointment.id);
      listOfAppointments[appointmenttIndex] = updatedAppointment;
      fs.writeFile('./db.json', JSON.stringify(data), (err) => {
        if (err) throw err;
      })
      res.send('Appointment updated');
    }
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))