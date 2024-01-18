import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = path.join(process.cwd(), "./db/contacts.json");

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath);
    const contactsParsed = JSON.parse(contacts);
    return console.log(contactsParsed);
  } catch (error) {
    return console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await fs.readFile(contactsPath);
    const contactsParsed = JSON.parse(contacts);

    let getContact = `The contact with ID "${contactId}" does not exist.`.red;

    contactsParsed.map((contact) => {
      if (contactId === contact.id) {
        getContact =
          ` Below are the contact details for id: "${contactId}"\n` +
          `${contact.name}\n${contact.email}\n${contact.phone}`.green;
      }
    });

    return console.log(getContact);
  } catch (error) {
    return console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await fs.readFile(contactsPath);
    const contactsParsed = JSON.parse(contacts);
    const index = contactsParsed.findIndex(
      (contact) => contact.id === contactId
    );

    if (index > 0) {
      contacts.splice(index, 1);

      const updatedContacts = JSON.stringify(contacts, null, 2);
      console.log(
        `Contact "${contacts[index].name}" successfully removed`.green
      );
      return fs.writeFile(contactsPath, updatedContacts);
    } else {
      return console.log(
        `The contact with ID "${contactId}" that you want to delete does not exist in your contacts.`
          .red
      );
    }
  } catch (error) {
    return console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = {
      id: nanoid(21),
      name,
      email,
      phone,
    };

    const contacts = await fs.readFile(contactsPath);
    const contactsParsed = JSON.parse(contacts);

    if (
      contactsParsed.find(
        (contact) =>
          contact.name?.toLowerCase() === newContact.name?.toLowerCase()
      )
    ) {
      console.log(`Contact ${name} already exist on list`.yellow);
      return;
    } else {
      contactsParsed.push(newContact);
    }

    const updatedContacts = JSON.stringify(contactsParsed, null, 2);
    await fs.writeFile(contactsPath, updatedContacts);
    return console.log(`Contact ${name} added successfully`.red);
  } catch (error) {
    return console.log(error.message);
  }
}

export { listContacts, getContactById, removeContact, addContact };
