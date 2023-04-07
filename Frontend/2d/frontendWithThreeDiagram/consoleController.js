document.getElementById('buttonGet').addEventListener('click', getRecord)
document.getElementById('buttonCreate').addEventListener('click', createRecord)
document.getElementById('buttonUpdate').addEventListener('click', updateRecord)
document.getElementById('buttonDelete').addEventListener('click', deleteRecord)

import { deleteAllRows, display } from './displayTableController.js'

let db = sessionStorage.getItem("db")
if(!db) db = "MySQL"

const url = `http://localhost:8080/ts/${db}/query/`;//////////

const consoleHeader = document.getElementById("databaseTitle")
consoleHeader.innerHTML = db


//maybe only render the console once this promise resolves/////////
let userid = ""
getUserid().then((result) => userid = result)

//Get a userid from the server, trying the saved userid first
function getUserid() {
    const idurl = "http://localhost:8080/assignid/"
    let headers = {}
    const currid = localStorage.getItem("userid")

    let prom = new Promise((resolve, reject) => {
        fetch(idurl + currid, {
            method : "GET",
            headers : headers
        })
        .then((response) => {
            return response.json()
        })
        .then((result) => {
            localStorage.setItem("userid", result.userid)
            resolve(result.userid)
        })    
        .catch((err) => {
            console.log(err)
            reject()
        })
    })
    return prom
}

async function getRecord() {

    const idInput = document.querySelector('#id').value;
    let idString = ''
    if(idInput){
        idString = '?objectid=' + idInput
    }
    fetch(url + userid + idString, {
        method: 'GET'
    })
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        console.log(result)
        deleteAllRows()
        display(result)
    })
}

async function createRecord() {

    const firstNameInput = document.querySelector('#firstName').value;
    const lastNameInput = document.querySelector('#lastName').value;
    const usernameInput = document.querySelector('#username').value;
    const passwordInput = document.querySelector('#password').value;

    fetch(url + userid, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            "firstName": firstNameInput, 
            "lastName":  lastNameInput, 
            "userName":  usernameInput,
            "password":  passwordInput
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        console.log(result)
        display(result)
    })
}

async function updateRecord() {

    const firstNameInput = document.querySelector('#firstName').value;
    const lastNameInput = document.querySelector('#lastName').value;
    const usernameInput = document.querySelector('#username').value;
    const passwordInput = document.querySelector('#password').value;
    const idInput = document.querySelector('#id').value;
    let idString = ''
    if(idInput){
        idString = '?objectid=' + idInput
    }

    fetch(url + userid + idString, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            "firstName": firstNameInput, 
            "lastName":  lastNameInput, 
            "userName":  usernameInput,
            "password":  passwordInput
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        console.log(result)
        display(result)
    })
}

async function deleteRecord() {

    const idInput = document.querySelector('#id').value;
    let idString = ''
    if(idInput){
        idString = '?objectid=' + idInput
    }
    fetch(url + userid + idString, {
        method: 'DELETE'
    })
    .then((response) => {
        return response.json()
    })
    .then((result) => {
        console.log(result)
        display(result)
    })
}

