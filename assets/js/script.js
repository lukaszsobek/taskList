"use strict"

let LocalKey = "lukaszsobek_taskList_application"


// make text input grow and shrink
autosize($('textarea'));


function getItems() {
// returns all items from local storage or []

	let itemList = localStorage.getItem(LocalKey)
	itemList = itemList ? JSON.parse(itemList) : []

	return itemList
}


function setItems(itemList) {
// saves a list of items to the local storage

	itemList = JSON.stringify(itemList)
	localStorage.setItem(LocalKey,itemList)

}


function loadLocalStore() {
// populate list with items from local storage

	// get
	let itemList = getItems()

	// append list
	itemList.map(function(item) {
		$("ul").append("<li draggable='true'><div class='textContent'>" + item + "</div><div class='deleteButton'><i class='fa fa-trash-o' aria-hidden='true'></i></div></li>")
	})
}

function saveItem(item) {
// save item to local storage

	let itemList = getItems()
	itemList.push(item)
	setItems(itemList)
}


function deleteItem(searchText) {
// delete an item

	let itemList = getItems()

	// delete
	let theKey = itemList.indexOf(searchText)
	itemList.splice(theKey,1)

	setItems(itemList)
}




// mark as done with css class
$("ul").on("click", "li", function() {
	$(this).toggleClass("markedDone")
})

// handles dargging
$("ul").on("dragstart", "li", function(e) {
	console.log(e)
})


// remove item on click
$("ul").on("click", ".deleteButton", function(e) {
	$(this).parent().fadeOut(500, function() {
		deleteItem($(this).text())
		$(this).remove()
	})
	e.stopPropagation()

})


// add new item to the ul list 
$("textarea").on("keypress", function(e) {
	if(e.which == 13
		&& $(this).val() != ""
		&& !e.shiftKey) {


		let textValue = $(this).val()
		saveItem(textValue)
		$(this).val("")
		e.preventDefault() // otherwise the enter ends up in the textarea
		autosize.update($('textarea'))
		console.log(this.val)
		$("ul").append("<li draggable='true'><div class='textContent'>" + textValue + "</div><div class='deleteButton'><i class='fa fa-trash-o' aria-hidden='true'></i></div></li>")

	} 
})


$(document).ready(loadLocalStore)