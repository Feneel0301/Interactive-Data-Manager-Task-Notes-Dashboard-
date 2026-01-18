// Dom Selections

const titleInput = document.querySelector(".title-input");
const descInput = document.querySelector(".desc-input");
const entryIdInput = document.querySelector(".entry-id");
const addBtn = document.querySelector(".add-btn");
const searchInput = document.querySelector(".search-input");
const filterSelect = document.querySelector(".filter-select");
const sortSelect = document.querySelector(".sort-select");
const entriesList = document.querySelector("entries-list");

// storing entry data
let entries=[];

// event listners
addBtn.addEventListener("click", handleAddOrUpdate);
searchInput.addEventListener("input", applyAllFilters);
filterSelect.addEventListener("change", applyAllFilters);
sortSelect.addEventListener("change", applyAllFilters);
entriesList.addEventListener("click", handleEntryActions);
window.addEventListener("DOMContentLoaded", loadEntries);

// functions

// add or update entry
function handleAddOrUpdate(){
    const title = titleInput.ariaValueMax.trim();
    const description = descInput.ariaValueMax.trim();
    const id = entryIdInput.value;

    if(!title||!description){
        alert("Title and description are required");
        return;
    }

    if(id){
        updateEntry(Number(id), title, description);
    }
    else{
        addEntry(title,description);
    }
    resetForm();
}

// add entry
function addEntry(title,description){
    entries.push({
        id:Date.now(),
        title,
        description,
        status:"active",
        date: Date.now()
    });
    saveEntries();
    applyAllFilters();
}

// update entry
function updateEntry(id, title, description){
    const index = entries.findIndex(entry => entry.id===id);
    if (index=== -1) return;

    entries.splice(index, 1, {
        ...entries[index],
        title,
        description
    });
    saveEntries();
    applyAllFilters();
}

// delete entry
function deleteEntry(id){
    entries = entries.filter(entry => entry.id !== id);
    saveEntries();
    applyAllFilters();
}