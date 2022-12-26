// // core module
const fs = require('fs');
// const readline = require('readline');
// const chalk = require('chalk');
// const validator = require('validator')

const contactFilePath = '../contact-app/contacts.json'


// const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); 

// const question = (input) => {
//   return new Promise((resolve, reject) => {
//     rl.question(`${input} `, (answer) => {
//       resolve(answer);
//     });
//   });
// };

const writeContact = (contacts) => {
  fs.writeFileSync(contactFilePath, JSON.stringify(contacts));
}

const loadContact = () => {
  const buffer = fs.readFileSync(contactFilePath, 'utf8');
  const contacts = JSON.parse(buffer);

  return contacts
}

const checkDuplicateName = (name) => {
  const contacts = loadContact();

  return contacts.find((contact) =>  contact.name === name) 
}

const updateContact = (name, updateContact) => {
  const contacts = loadContact();
  const newContacts = contacts.filter((c) => c.name.toLowerCase() !== name.toLowerCase() )
  
  delete updateContact.oldName
  newContacts.push(updateContact);
  writeContact(newContacts)
};

const saveContact = (newContact) => {
  if (!fs.existsSync(contactFilePath))
    fs.writeFileSync(contactFilePath, '[]', 'utf8');

  const contacts = loadContact();
  contacts.push(newContact);

  writeContact(contacts)
};

const detailContact = (name) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase() )
  
  return contact
}

const deleteContact = (name) => {
  const contacts = loadContact();
  const newContacts = contacts.filter((c) => c.name.toLowerCase() !== name.toLowerCase() )

  if (contacts.length == newContacts.length) {
    return false;
  } 

  writeContact(contacts)
}

// module.exports = { question, saveContact, listContact, detailContact, deleteContact }

module.exports = { loadContact, detailContact, saveContact, checkDuplicateName, deleteContact, updateContact }







