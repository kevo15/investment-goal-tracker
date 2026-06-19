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
        .then((pageData) => {
            emptyTable();               // use function to empty table and only show new values
            currentGoals = pageData.content;
            pageButtons(pageData, URL);
            pageData.content.forEach(goal => addGoalToTable(goal));        // adds found goals to table
            pageData.content.forEach(goal => addStatusToTable(goal));
        })
        .catch((error) => {
            goalDeny.showModal();       // shows same validation message
        })
        .finally(() => {      
            findBy.close();             // closes findBy popup
            document.getElementById("find-by-form").reset();    // resets find By popup to default values
        })
}

// function used to find page contents by page number
const findByPage = (num, url) => {
    pageNum = num;                      // sets page number to given num
    let myUrl = new URL(url);           // creates url value
    myUrl.searchParams.set("page", num);        // updates page number search param
    let currentUrl = myUrl.toString();          // returns the value to a string for fetch call

    fetch(currentUrl, {method: "GET"})
        .then((httpResponse) => {

            if(httpResponse.status === 200) {       // returns a status code 200 on completion
                return httpResponse.json();         // returns an investment goal
            }
            return null;
        })
        .then((pageData) => {
            emptyTable();                           // use function to empty table and only show new values
            currentGoals = pageData.content;        // populates current goals array with new goals
            currentGoals.forEach(goal => addGoalToTable(goal));        // adds found goals to table
            currentGoals.forEach(goal => addStatusToTable(goal));
        })
        .catch((error) => {
            goalDeny.showModal();       // shows same validation message
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

const addStatusToTable = (newGoal) => { // takes in a goal
    // creates a new row for the table
    let tr  = document.createElement("tr");

    // creating cells that will store values for columns that will be put in the table row
    let nameTD = document.createElement("td");
    let typeTD = document.createElement("td");
    let priorityTD = document.createElement("td");
    let progressTD = document.createElement("td");
    let statusTD = document.createElement("td");

    let updBtnTD = document.createElement("td");

    let date = new Date(newGoal.targetDate);
    let today = Date.now();
    let daysAway = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    let progressPercent = (newGoal.currentAmount / newGoal.targetAmount) * 100;

    // assigning values from the goal to the cells
    nameTD.innerText = newGoal.name;
    typeTD.innerText = convertType(newGoal.goalType);       // converts to string before adding to table
    progressTD.innerHTML = `
        <div class="progress" style="height: 30px;">
            <div 
                class="progress-bar" 
                role="progressbar" 
                style="width: ${progressPercent}%; font-size: 16px;"
                aria-valuenow="${newGoal.currentAmount}" 
                aria-valuemin="0" 
                aria-valuemax="${newGoal.targetAmount}">
                ${Math.round(progressPercent)}%
            </div>
        </div>
    `;    
    priorityTD.innerText = newGoal.priority;
    statusTD.classList.add("text-center");
    statusTD.innerHTML = daysStatus(daysAway);

    console.log(daysAway);

    // creating the update button giving it an id and action to perform when clicked
    updBtnTD.innerHTML = `<button class="btn update-button p-1" onclick="updateGoalForm(${newGoal.id})" id="UPD-${newGoal.id}">Update</button>`;

    // adding the cells to the row
    tr.appendChild(nameTD);
    tr.appendChild(typeTD);
    tr.appendChild(priorityTD);
    tr.appendChild(progressTD);
    tr.appendChild(statusTD);
    tr.appendChild(updBtnTD);

    // creating an id for the row that uses the goal id so each row has a unique id
    tr.setAttribute("id", `TR-${newGoal.id}`);

    // adding the row to the table body
    let tableBody = document.getElementById("investment-status-table-body");
    tableBody.appendChild(tr);
}

// function used to dynamically render page numbers
const pageButtons = (pageData, url) => {
    // takes the total page number from response value
    totalPages = pageData.totalPages;

    let pageButtonContainer = document.getElementById("page-buttons");

    // make sure all buttons are cleared
    pageButtonContainer.innerHTML = "";

    // loop through current pages
    for (let i = 0; i < totalPages; i++) {
        let button = document.createElement("button");

        // assigns button class for styling, id for lister, and value
        button.className = "btn crud-button h5";
        button.id = `page-${i + 1}`;
        button.textContent = i + 1;

        // i is the page recieved from database
        button.addEventListener("click", () => {
            findByPage(i, url);
        });

        pageButtonContainer.appendChild(button);
    }
};

// function to clear out table
const emptyTable = () => {
    // sets table HTML to nothing to remove table body without removing id
    document.getElementById("investment-goal-table-body").innerHTML = "";
}

// function to populate table with all goals in the allGoals array
const resetTable = (goals) => {
    emptyTable();
    goals.forEach(goal => addGoalToTable(goal));
    goals.forEach(goal => addStatusToTable(goal));
}

const renderBothTables = () => {
    document.getElementById("investment-goal-table-body").innerHTML = "";
    document.getElementById("investment-status-table-body").innerHTML = "";

    currentGoals.forEach((goal) => {
        addGoalToTable(goal);
        addStatusToTable(goal);
    });
};

// function used to make sure the selected goal is stored
const updateGoalForm = (goalId) => {
    // loops through list of goals and finds the current goal id
    for(let goal of currentGoals) {
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
    currentGoals.sort((goalA, goalB) => {
        let valueA;
        let valueB;

        if (row === "name") {
            valueA = goalA.name;
            valueB = goalB.name;
        } else if (row === "date") {
            valueA = new Date(goalA.targetDate);
            valueB = new Date(goalB.targetDate);
        } else if (row === "progress") {
            valueA = goalA.targetAmount - goalA.currentAmount;
            valueB = goalB.targetAmount - goalB.currentAmount;
        } else if (row === "priority") {
            valueA = priorityOrdinal(goalA.priority);
            valueB = priorityOrdinal(goalB.priority);
        }

        if (type === "up") {
            if (!isNaN(valueA) && !isNaN(valueB)) {
                return valueA - valueB;
            }

            return String(valueA).localeCompare(String(valueB));
        } else {
            if (!isNaN(valueA) && !isNaN(valueB)) {
                return valueB - valueA;
            }

            return String(valueB).localeCompare(String(valueA));
        }
    });

    renderBothTables();
};

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

const daysStatus = (daysAway) => {
    if(daysAway == 0 || daysAway < 0) {
        return `<span class="badge badge-pill text-center completed-status">Completed</span>`;
    } else if(daysAway < 365) {
        return `<span class="badge badge-pill at-risk">At Risk</span>`; 
    } else if (daysAway < 800) {
        return `<span class="badge badge-pill on-track">On Track</span>`;
    } else if (daysAway > 800) {
        return `<span class="badge badge-pill no-risk">Recently Started</span>`;
    }
}