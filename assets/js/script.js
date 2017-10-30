"use strict"

let LocalKey = "lukaszsobek_taskList_application"


// make text input grow and shrink
autosize($('textarea'));


// enable sort
const el = document.getElementById('items');
const sortable = new Sortable.create(el, {
	onEnd: (e) => {

		const newList = []
		const shownList = e.to.querySelectorAll(".textContent")
		shownList.forEach((item) => {
			newList.push(item.textContent)
		})
		setItems(newList)
		
		}
	}
);


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
		item = item.replace(/(?:\r\n|\r|\n)/g, '<br />');
		$("ul").append("<li><div class='textContent'>" + item + "</div><div class='deleteButton'><i class='fa fa-trash-o' aria-hidden='true'></i></div></li>")
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


// edit item
$("ul").on("click", "li", function() {
	//$(this).toggleClass("markedDone")
	let test = $(this).find("div.textContent")
	console.log(test[0])

	// get value of div
	// replace div with textarea
	// save on enter

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
		textValue = textValue.replace(/(?:\r\n|\r|\n)/g, '<br />');
		$("ul").append("<li><div class='textContent'>" + textValue + "</div><div class='deleteButton'><i class='fa fa-trash-o' aria-hidden='true'></i></div></li>")

	} 
})


$(document).ready(loadLocalStore)