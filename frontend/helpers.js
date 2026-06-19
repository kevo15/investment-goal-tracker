// Helper Functions

// function used to call get request with different search params
const findByUrl = (URL) => {
    // takes in url that includes proper search param
    fetch(URL, {method: "GET"})
        .then((httpResponse) => {

            if(httpResponse.status === 200) {       // returns a status code 200 on completion
                return httpResponse.json();         // returns an investment goal
            }
            return null;
        })
        .then((goals) => {
            emptyTable();               // use function to empty table and only show new values
            goals.forEach(goal => addGoalToTable(goal));        // adds found goals to table
        })
        .catch((error) => {
            goalDeny.showModal();       // shows same validation message
        })
        .finally(() => {      
            findBy.close();             // closes findBy popup
            document.getElementById("find-by-form").reset();    // resets find By popup to default values
        })
}

// function used to populate table with a new goal
const addGoalToTable = (newGoal) => { // takes in a goal

    // creates a new row for the table
    let tr  = document.createElement("tr");

    // creating cells that will store values for columns that will be put in the table row
    let nameTD = document.createElement("td");
    let typeTD = document.createElement("td");
    let currentTD = document.createElement("td");
    let targetTD = document.createElement("td");
    let priorityTD = document.createElement("td");
    let dateTD = document.createElement("td");

    let updBtnTD = document.createElement("td");

    // assigning values from the goal to the cells
    nameTD.innerText = newGoal.name;
    typeTD.innerText = convertType(newGoal.goalType);       // converts to string before adding to table
    currentTD.innerText = newGoal.currentAmount;
    targetTD.innerText = newGoal.targetAmount;
    priorityTD.innerText = newGoal.priority;
    dateTD.innerText = newGoal.targetDate;

    // creating the update button giving it an id and action to perform when clicked
    updBtnTD.innerHTML = `<button class="btn update-button p-1" onclick="updateGoalForm(${newGoal.id})" id="UPD-${newGoal.id}">Update</button>`;

    // adding the cells to the row
    tr.appendChild(nameTD);
    tr.appendChild(typeTD);
    tr.appendChild(currentTD);
    tr.appendChild(targetTD);
    tr.appendChild(priorityTD);
    tr.appendChild(dateTD);
    tr.appendChild(updBtnTD);

    // creating an id for the row that uses the goal id so each row has a unique id
    tr.setAttribute("id", `TR-${newGoal.id}`);

    // adding the row to the table body
    let tableBody = document.getElementById("investment-goal-table-body");
    tableBody.appendChild(tr);
}

// function to clear out table
const emptyTable = () => {
    // sets table HTML to nothing to remove table body without removing id
    document.getElementById("investment-goal-table-body").innerHTML = "";
}

// function to populate table with all goals in the allGoals array
const resetTable = (goals) => {
    emptyTable();
    goals.forEach(goal => addGoalToTable(goal));
}

// function used to edit values of table without refresh
const editGoalInTable = (goal) => {

    /**
     * using the current goal id to connect to the correct table row
     *      updating the table cells with the values of the current goal
     */
    document.getElementById(`TR-${goal.id}`).innerHTML = `
    <td>${goal.name}</td>
    <td>${goal.goalType}</td>
    <td>${goal.currentAmount}</td>
    <td>${goal.targetAmount}</td>
    <td>${goal.priority}</td>
    <td>${goal.targetDate}</td>
    <td><button class="btn btn-primary p-1" onclick="updateGoalForm(${goal.id})" id="UPD-${goal.id}">Update</button></td>
    `
}

// function used to remove a goal from the table
const removeGoalFromTable = (goalId) => {
    // find the current table row with the goal id and removes it
    document.getElementById(`TR-${goalId}`).remove();
}

// function used to make sure the selected goal is stored
const updateGoalForm = (goalId) => {
    // loops through list of goals and finds the current goal id
    for(let goal of allGoals) {
        if(goal.id === goalId) {
            selectedGoal = goal; // makes the selected goal the found goal
            break;
        }
    }

    updPopup.showModal();
}

// function that populates the values of the update form with the current goal
const updForm = () => {
    document.getElementById("edit-goal-name").value = selectedGoal.name;
    document.getElementById("edit-goal-type").value = selectedGoal.goalType;
    document.getElementById("edit-goal-current").value = selectedGoal.currentAmount;
    document.getElementById("edit-goal-target").value = selectedGoal.targetAmount;
    document.getElementById("edit-goal-priority").value = selectedGoal.priority;
    document.getElementById("edit-goal-date").value = selectedGoal.targetDate;
}

// function that populates the values of the delete form with the current goal
const delForm = () => {
    document.getElementById("del-goal-name").value = selectedGoal.name;
    document.getElementById("del-goal-type").value = selectedGoal.goalType;
    document.getElementById("del-goal-current").value = selectedGoal.currentAmount;
    document.getElementById("del-goal-target").value = selectedGoal.targetAmount;
    document.getElementById("del-goal-priority").value = selectedGoal.priority;
    document.getElementById("del-goal-date").value = selectedGoal.targetDate;
}

// function used to sort table using column as a string and up/down for type
const sortTable = (row, type) => {          
    let table = document.getElementById("investment-goal-table");
    let rows = Array.prototype.slice.call(table.querySelectorAll("tbody > tr"));
    let cellA; let cellB;

    // sorts the rows by columns
    rows.sort(function(rowA, rowB) {
        // if statement to get proper column values
        if(row == "name") {
            cellA = rowA.cells[0].textContent;
            cellB = rowB.cells[0].textContent;
        } else if(row == "date") {
            cellA = rowA.cells[5].textContent;
            cellB = rowB.cells[5].textContent;
        } else if(row == "progress") {
            cellA = rowA.cells[3].textContent - rowA.cells[2].textContent;
            cellB = rowB.cells[3].textContent - rowB.cells[2].textContent;
        } else if(row == "priority") {
            cellA = priorityOrdinal(rowA.cells[4].textContent);
            cellB = priorityOrdinal(rowB.cells[4].textContent);
        }
        // if statement to see if it should compare ascending/descending
        if(type == "up") {
            // compare for numerical values
            if (!isNaN(cellA) && !isNaN(cellB)) {
                return cellA - cellB;
            }
            // compare for spring values
            return cellA.localeCompare(cellB); 
        } else {
            // returns negative value to descend
            if (!isNaN(cellA) && !isNaN(cellB)) {
                return -(cellA - cellB);
            }
            return -(cellA.localeCompare(cellB));
        }
    })

    // readjusts table by sorted rows
    rows.forEach(function(row) {
    table.querySelector("tbody").appendChild(row);
    });
}

// function used to return ordinal values of priority enum
const priorityOrdinal = (text) => {
    if(text === "LOW") {
        return 0;
    } else if(text === "MEDIUM") {
        return 1;
    } else {
        return 2;
    }
}

// function used to change goal type enum to normal string
const convertType = (text) => {
    if(text === "WEALTH_ACCUMULATION") {
        return "Wealth Accumulation";
    } else if(text === "COLLEGE_SAVINGS") {
        return "College Savings"
    } else if(text === "HOME_PURCHASES") {
        return "Home Purchases";
    } else if(text === "RETIREMENT") {
        return "Retirement";
    } else {
        return "Emergency Fund";
    }
}