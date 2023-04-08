export function display(data){        
    for(let row of data){
        addRow(row.id, row.firstName, row.lastName, row.username, row.password)
    }
}

export function addRow(idValue, firstNameValue, lastNameValue, usernameValue, passwordValue) {

    // Get the table body
    var tbody = document.getElementById('displyTable');

    // Create a new row
    var newRow = document.createElement('tr');

    // Create cells for each column
    var idCell = document.createElement('td');
    var firstNameCell = document.createElement('td');
    var lastNameCell = document.createElement('td');
    var usernameCell = document.createElement('td');
    var passwordCell = document.createElement('td');

    // Set the text content of each cell
    idCell.innerHTML = idValue;
    firstNameCell.innerHTML = firstNameValue;
    lastNameCell.innerHTML = lastNameValue;
    usernameCell.innerHTML = usernameValue;
    passwordCell.innerHTML = passwordValue;

    // Append the cells to the new row
    newRow.appendChild(idCell);
    newRow.appendChild(firstNameCell);
    newRow.appendChild(lastNameCell);
    newRow.appendChild(usernameCell);
    newRow.appendChild(passwordCell);

    // Append the new row to the table body
    tbody.appendChild(newRow);
}

export function deleteRow(idValue) {
    // Get the table body
    var tbody = document.getElementById('displyTable');

    // Find the row with the matching ID value
    var rows = tbody.querySelectorAll('tr');
    for (var i = 0; i < rows.length; i++) {
        var idCell = rows[i].querySelector('td:first-child');
        if (idCell?.innerHTML == idValue) {
            rows[i].remove()
            break;
        }
    }
}

export function deleteAllRows() {
    // Get the table body
    var tbody = document.getElementById('displyTable');

    // Find the row with the matching ID value
    var rows = tbody.querySelectorAll('tr');
    for (var i = 1; i < rows.length; i++) {
        rows[i].remove()
    }
}