"use strict"

const LocalKey = "lukaszsobek_taskList_application"
const state = {}

// enable autosizing textareas
autosize($('textarea'));

// enable drag & drop items
const el = document.getElementById('items');
const sortable = new Sortable.create(el, {
	filter: "textarea",
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


// populate list with items from local storage
function loadLocalStore() {
	const itemList = getItems()

	if (itemList.length < 1) return

	itemList.forEach(function(item) {
		item = item.replace(/(?:\r\n|\r|\n)/g, '<br />');
		$("ul").append("<li><div class='textContent'>" + item + "</div><div class='deleteButton'><i class='fa fa-trash-o' aria-hidden='true'></i></div></li>")
	})
}


// returns all items from local storage or []
function getItems() {

	const emptyList = {
		props: {},
		lists: [
			{ name: "taskList", items: [] }
		]
	}
	const locStor = localStorage.getItem(LocalKey)
	const appStore = locStor ? JSON.parse(locStor) : emptyList

	const itemList = appStore.lists[0].items

	updateTitleCount(itemList)
	return state.itemList = itemList
}


// updates page title with item count
function updateTitleCount(itemList) {
	state.itemCount = itemList.length
	$("#headerCount")[0].textContent = " (" + state.itemCount + ")"
}


// add new item to the ul list
$("#taskInput").on("keypress", function(e) {
	if(e.which == 13
		&& $(this).val() != ""
		&& !e.shiftKey) {

		let textValue = $(this).val()
		addItem(textValue)
		$(this).val("")

		e.preventDefault() // otherwise the enter ends up in the textarea
		autosize.update($('#taskInput'))

		textValue = textValue.replace(/(?:\r\n|\r|\n)/g, '<br />');
		$("ul").append("<li><div class='textContent'>" + textValue + "</div><div class='deleteButton'><i class='fa fa-trash-o' aria-hidden='true'></i></div></li>")
	}
})


// adds item to itemList
function addItem(item) {
	let itemList = state.itemList
	itemList.push(item)
	setItems(itemList)
}


// saves the list of items to the local storage
function setItems(itemList) {
	const saveList = {
		props: {},
		lists: [
			{ name: "default", items: itemList }
		]
	}

	const saveListStr = JSON.stringify(saveList)
	localStorage.setItem(LocalKey,saveListStr)
	updateTitleCount(itemList)
}


// delete an item
function deleteItem(searchText) {
	let itemList = state.itemList
	let theKey = itemList.indexOf(searchText)
	itemList.splice(theKey,1)
	setItems(itemList)
}


// edit item
$("ul").on("dblclick", "li", function(e) {
	if(e.target.className == "itemEdit") {
		return
	}

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
	let itemList = state.itemList
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


$(document).ready(loadLocalStore)
