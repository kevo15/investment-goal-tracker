// All CRUD operations

const BACKEND_URL = "http://localhost:8081/investment";
let currentUrl = BACKEND_URL;
let currentGoals = [];      // variable to hold the investment goals
let selectedGoal;           // variable that stores the current investment goal
let pageNum = 0;
let totalPages = 1;

document.addEventListener("DOMContentLoaded", () => {

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {

        if(xhr.readyState === 4) {

            let pageData = JSON.parse(xhr.responseText);

            console.log(pageData);

            // add all goals from database into an array
            currentGoals = pageData.content;

            // for each found goal calls method that populates the table
            pageData.content.forEach(goal => addGoalToTable(goal));
            pageButtons(pageData, BACKEND_URL);
        }
    };

    xhr.open("GET", BACKEND_URL);

    xhr.send();

});

// script used to create goal within the form
document.getElementById("new-goal-form").addEventListener("submit", (eventInfo) => {

    eventInfo.preventDefault();

    let inputData = new FormData(document.getElementById("new-goal-form"));

    // creating a new goal record with all inputted values from the form
    const newGoal = {
        name: inputData.get("new-goal-name"),
        goalType: inputData.get("new-goal-type"),
        currentAmount: inputData.get("new-goal-current"),
        targetAmount: inputData.get("new-goal-target"),
        priority: inputData.get("new-goal-priority"),
        targetDate: inputData.get("new-goal-date")
    }

    // calls backend Post request
    fetch(BACKEND_URL, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(newGoal)
    })
    .then((httpResponse) => {
        if(httpResponse.status === 201) {   // request returns 201 on success
            return httpResponse.json();     // returns an investment goal object
        }
        return null;
    })
    .then((goal) => {
        addGoalToTable(goal);       // adds new investment goal to table
        addStatusToTable(goal);
        currentGoals.push(goal);        // add the goal to the list of goals
    })
    .catch((error) => {
        goalDeny.showModal();       // displays a popup menu that tells the user their request was invalid
    })
    .finally(() => {
        goalPopup.close();          // closes form that allows user to create investment goal
        document.getElementById("new-goal-form").reset();       // reset the create goal form to placeholder values
    })
    
});

// script used to edit investment goal connected to the HTML form
document.getElementById("edit-goal-form").addEventListener("submit", (eventInfo) => {

    eventInfo.preventDefault();

    let inputData = new FormData(document.getElementById("edit-goal-form"));

    // creating a new goal with values from the form
    const newGoal = {
        id: selectedGoal.id,
        name: inputData.get("edit-goal-name"),
        goalType: inputData.get("edit-goal-type"),
        currentAmount: inputData.get("edit-goal-current"),
        targetAmount: inputData.get("edit-goal-target"),
        priority: inputData.get("edit-goal-priority"),
        targetDate: inputData.get("edit-goal-date")
    }

    // calls Put request with id of the current goal
    fetch(BACKEND_URL + `/${selectedGoal.id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(newGoal)
    })
    .then((httpResponse) => {
        if(httpResponse.status === 200) {       // request returns 200 on success
            return httpResponse.json();         // returns investment goal
        }
        return null;
    })
    .then((goal) => {
        currentGoals.pop(selectedGoal);         // remove the current version of the goal from the list of goals
        currentGoals.push(goal);                // add the updated version of the goal to the list
        renderBothTables(goal);
    })
    .catch((error) => {
        console.log(error);
        goalDeny.showModal();               // displays same error message for invalid inputs
    })
    .finally(() => {
        editGoalPopup.close();              // closes edit form
        document.getElementById("edit-goal-form").reset();      // resets the edit goal form to default values
    })
    
});

// script used to delete investment goal from database using form
document.getElementById("del-goal-form").addEventListener("submit", (eventInfo) => {

    eventInfo.preventDefault();

    // calls Delete request with the id of the current goal
    fetch(BACKEND_URL + `/${selectedGoal.id}`, {method: "DELETE"})
    .then((httpResponse) => {

        if(httpResponse.status === 204) {           // checks request for valid success status code
            currentGoals.pop(selectedGoal);
            renderBothTables();
        }
    })
    .catch((error) => {
        goalDeny.showModal();               // shows same message if an error occurs while deleting
    })
    .finally(() => {
        delGoalPopup.close();               // closes form for deleting goal
        document.getElementById("del-goal-form").reset();       // resets delete goal form to default values
    })
});

// script used to search by different columns
document.getElementById("find-by-form").addEventListener("submit", (eventInfo) => {

    eventInfo.preventDefault();

    // checks to see if goal type or goal priority updates are populated to only update one at a time
    if(document.getElementById("find-goal-type").value == "" && document.getElementById("find-goal-priority").value == "") {
        // assigns input name value to a variable to add it to URL
        let searchName = document.getElementById("find-goal-name").value;
        // creates a Url for helper function
        currentUrl = BACKEND_URL + `?name=${searchName}`;
        // calls helper function to find by name
        findByUrl(currentUrl);
    } else if(document.getElementById("find-goal-priority").value == "") {      // check if priority is populated
        // creates a variable to get goal type input
        let searchType = document.getElementById("find-goal-type").value;
        // creates url for helper function
        currentUrl = BACKEND_URL + `?goalType=${searchType}`;
        // calls helper function to find by type
        findByUrl(currentUrl,);
    } else {
        // creates variable to hold goal priority input
        let searchPriority = document.getElementById("find-goal-priority").value;
        // creates url for helper function
        currentUrl = BACKEND_URL + `?priority=${searchPriority}`;
        // calls helper function to find by priority
        findByUrl(currentUrl);
    }
})
