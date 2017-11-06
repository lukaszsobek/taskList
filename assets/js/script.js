"use strict"

const LocalKey = "lukaszsobek_taskList_application"
const varStore = {}


// make text input grow and shrink
//autosize($('#taskInput, .itemEdit'));
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
	let itemList = getItems()
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
	varStore.textContent = selectedDiv.textContent
	autosize(txtArea[0])
	txtArea[0].focus()
})

// save item after editing
$("ul").on("blur", "textarea", function(e) {
	const txtArea = e.target
	const theDiv = $("<div />")
	theDiv.addClass("textContent")
	theDiv.text(varStore.textContent)
	txtArea.replaceWith(theDiv[0])
	//
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