import { deleteAllRows, display } from './displayTableController.js'


let db = sessionStorage.getItem("db")
if(!db) db = "MySQL"

const domain = window.location.hostname;
console.log("hostname", window.location)
console.log("hostname", window.location.hostname)

const queryUrl = `${domain}/ts/${db}/query/`;
http://3.145.88.185:8080/dist/3.145.88.185/ts/MySQL/query/

const consoleHeader = document.getElementById("databaseTitle")
consoleHeader.innerHTML = db


let userid = ""
getUserid().then((result) => userid = result)

//Get a userid from the server, trying the saved userid first
function getUserid() {
    const idurl = `${domain}/assignid/`
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



document.getElementById('buttonGet').addEventListener('click', getRecord)
document.getElementById('buttonCreate').addEventListener('click', createRecord)
document.getElementById('buttonUpdate').addEventListener('click', updateRecord)
document.getElementById('buttonDelete').addEventListener('click', deleteRecord)

async function getRecord() {

    const idInput = document.querySelector('#id').value;
    let idString = ''
    if(idInput){
        idString = '?objectid=' + idInput
    }
    fetch(queryUrl + userid + idString, {
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

    fetch(queryUrl + userid, {
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

    fetch(queryUrl + userid + idString, {
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
    fetch(queryUrl + userid + idString, {
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

