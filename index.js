import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://app1-e6167-default-rtdb.firebaseio.com//"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const todoListDB = ref(database, "todoList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = { check : false, task : inputFieldEl.value}
    //let inputValue = inputFieldEl.value
    if(inputValue.task)
        push(todoListDB, inputValue)
    
    clearInputFieldEl()
})

onValue(todoListDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            
            appendItemToListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "   😊😊 Please add tasks... 😊😊   "
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    newEl.textContent = itemValue.task
    
    if(itemValue.check)
        newEl.setAttribute('class', 'task-done')
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `todoList/${itemID}`)
        if(itemValue.check === false) {
            const updateItem = {
                ...item[1],
                check : 'true'
            }
            update(exactLocationOfItemInDB, updateItem)
        }
        else{
            remove(exactLocationOfItemInDB)
        }
        
    })
    
    shoppingListEl.append(newEl)
}
