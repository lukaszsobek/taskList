"use strict"

const LocalKey = "lukaszsobek_taskList_application"
const state = {}

// enable autosizing textareas
autosize($('textarea'));

// enable drag & drop items
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

// updates page title with item count
function updateTitleCount(itemList) {
	state.itemCount = itemList.length
	$("#headerCount")[0].textContent = " (" + state.itemCount + ")"
}


// returns all items from local storage or []
function getItems() {
	let itemList = localStorage.getItem(LocalKey)
	itemList = itemList ? JSON.parse(itemList) : []
	updateTitleCount(itemList)
	return itemList
}


// saves a list of items to the local storage
function setItems(itemList) {
	const itemListStr = JSON.stringify(itemList)
	localStorage.setItem(LocalKey,itemListStr)
	updateTitleCount(itemList)
}


// populate list with items from local storage
function loadLocalStore() {
	const itemList = getItems()
	itemList.forEach(function(item) {
		item = item.replace(/(?:\r\n|\r|\n)/g, '<br />');
		$("ul").append("<li><div class='textContent'>" + item + "</div><div class='deleteButton'><i class='fa fa-trash-o' aria-hidden='true'></i></div></li>")
	})
}


// save item to local storage
function saveItem(item) {
	let itemList = getItems()
	itemList.push(item)
	setItems(itemList)
}


// delete an item
function deleteItem(searchText) {
	let itemList = getItems()
	let theKey = itemList.indexOf(searchText)
	itemList.splice(theKey,1)
	setItems(itemList)
}


// edit item
$("ul").on("dblclick", "li", function() {
	const selectedDiv = $(this).find("div.textContent")[0]
	const txtArea = $("<textarea />")
	txtArea.addClass("itemEdit")
	txtArea.val(selectedDiv.textContent)
	selectedDiv.replaceWith(txtArea[0])
	state.textContent = selectedDiv.textContent
	autosize(txtArea[0])
	txtArea[0].focus()
})

// handle returning to normal state after edit
$("ul").on("blur", "textarea", function(e) {
	const txtArea = e.target
	const theDiv = $("<div />")
	theDiv.addClass("textContent")
	updateValue(state.textContent, txtArea.value)
	theDiv.text(txtArea.value)
	txtArea.replaceWith(theDiv[0])
	
})


// update item
function updateValue(oldValue,newValue) {
	const itemList = getItems()
	const itemId = itemList.indexOf(oldValue)
	itemList[itemId] = newValue
	setItems(itemList)
}


// remove item on delete click
$("ul").on("click", ".deleteButton", function(e) {
	$(this).parent().fadeOut(500, function() {
		deleteItem($(this).text())
		$(this).remove()
	})
	e.stopPropagation()
})


// add new item to the ul list 
$("#taskInput").on("keypress", function(e) {
	if(e.which == 13
		&& $(this).val() != ""
		&& !e.shiftKey) {

		let textValue = $(this).val()

		saveItem(textValue)
		$(this).val("")
		e.preventDefault() // otherwise the enter ends up in the textarea
		autosize.update($('#taskInput'))
		textValue = textValue.replace(/(?:\r\n|\r|\n)/g, '<br />');
		$("ul").append("<li><div class='textContent'>" + textValue + "</div><div class='deleteButton'><i class='fa fa-trash-o' aria-hidden='true'></i></div></li>")

	} 
})


$(document).ready(loadLocalStore)