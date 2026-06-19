// Modals
const goalPopup = document.getElementById("add-goal-popup");        // create goal modal
const findBy = document.getElementById("find-by-popup");            // find goal popup
const sortBy = document.getElementById("sort-by-popup");            // sort goal popup
const goalDeny = document.getElementById("invalid-goal");           // error popup
const updPopup = document.getElementById("upd-goal-popup");         // update goal modal that stores edit and delete
const editGoalPopup = document.getElementById("edit-goal-popup");   // edit goal modal
const delGoalPopup = document.getElementById("del-goal-popup");     // delete goal modal

// button handlers
document.getElementById("add-goal-btn").addEventListener("click", () => {
    goalPopup.showModal();
})      // create goal button
document.getElementById("find-goal-btn").addEventListener("click", () => {
    findBy.showModal();
})      // find goal button
document.getElementById("sort-goal-btn").addEventListener("click", () => {
    sortBy.showModal();
})      // sort goal button
document.getElementById("close-goal-btn").addEventListener("click", () => {
    goalPopup.close();
})      // close create goal modal button
document.getElementById("find-all-btn").addEventListener("click", () => {
    findByUrl(BACKEND_URL)
    findBy.close();
})      // button to find all goals 
document.getElementById("by-name-up").addEventListener("click", () => {
    sortTable("name", "up");
    sortBy.close();
})      // sort by name ascending
document.getElementById("by-name-down").addEventListener("click", () => {
    sortTable("name", "down");
    sortBy.close();
})      // sort by name descending
document.getElementById("by-date-up").addEventListener("click", () => {
    sortTable("date", "up");
    sortBy.close();
})      // sort by date ascending
document.getElementById("by-date-down").addEventListener("click", () => {
    sortTable("date", "down");
    sortBy.close();
})      // sort by date descending
document.getElementById("by-progress-up").addEventListener("click", () => {
    sortTable("progress", "up");
    sortBy.close();
})      // sort by progress ascending
document.getElementById("by-progress-down").addEventListener("click", () => {
    sortTable("progress", "down");
    sortBy.close();
})      // sort by progress descending
document.getElementById("by-priority-up").addEventListener("click", () => {
    sortTable("priority", "up");
    sortBy.close();
})      // sort by priority ascending
document.getElementById("by-priority-down").addEventListener("click", () => {
    sortTable("priority", "down");
    sortBy.close();
})      // sort by priority descending
document.getElementById("edit-btn").addEventListener("click", () => {
    updForm();
    editGoalPopup.showModal();
    updPopup.close();
})      // edit goal button
document.getElementById("close-edit-btn").addEventListener("click", () => {
    editGoalPopup.close();
})      // close edit goal modal button
document.getElementById("del-btn").addEventListener("click", () => {
    delForm();
    delGoalPopup.showModal();
    updPopup.close();
})      // delete goal button
document.getElementById("close-del-btn").addEventListener("click", () => {
    delGoalPopup.close();
})      // close delete goal modal button
document.getElementById("previous").addEventListener("click", () => {
    if(pageNum <= 0 || pageNum > totalPages - 1) {
        pageNum = 0;
        emptyTable();
        findByPage(pageNum, currentUrl);
    } else if(pageNum != 0) {
        pageNum--;
        emptyTable();
        findByPage(pageNum, currentUrl);
    }
})      // previous button for page navigation
document.getElementById("next").addEventListener("click", () => {
    if(pageNum >= totalPages - 1 || pageNum < 0) {
        pageNum = totalPages - 1;
        emptyTable();
        findByPage(pageNum, currentUrl);
    } else if(pageNum != totalPages) {
        pageNum++;
        emptyTable();
        findByPage(pageNum, currentUrl);
    } 
})      // next button for page navigation