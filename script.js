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

// edit form
function loadEntryForEdit(id){
    const entry = entries.find(entry => entry.id === id);
    if(!entry) return;
    titleInput.value = entry.title;
    descInput.value = entry.description;
    entryIdInput.value = entry.id;
    addBtn.textContent = "Update";
}

// status toggle
function toggleStatus(id){
    const entry = entries.find(entry => entry.id === id);
    if(!entry) return;
    entry.status = entry.status === "active" ? "completed" : "active";
    saveEntries();
    applyAllFilters();
}

// search filter and sort
function applyAllFilters(){
    let result = [...entries];

    // search
    const searchValue = searchInput.value.trim().toLowerCase();
    if(searchValue){
        result = result.filter(entry =>
            entry.title.toLowerCase().includes(searchValue) ||
            entry.description.toLowerCase().includes(searchValue)
        );
    }

    // filter
    const filterValue = filterSelect.value;
    if(filterValue !== "all"){
        result = result.filter(entry => entry.status === filterValue);
    }

    // sort
    const sortValue = sortSelect.value;
    if(sortValue === "title"){
        result.sort((a,b) => a.title.localeCompare(b.title));
    } else{
        result.sort((a,b) => b.date - a.date);
    }
    renderEntries(result);
}
// Render entries to DOM
function renderEntries(list) {
  entriesList.innerHTML = "";

  if (list.length === 0) {
    entriesList.innerHTML = "<p>No entries found</p>";
    return;
  }

  list.forEach(entry => {
    const card = document.createElement("div");
    card.className = "entry-card";
    card.dataset.id = entry.id;

    card.innerHTML = `
      <div class="entry-info">
        <h3 class="entry-title">${entry.title}</h3>
        <p class="entry-desc">${entry.description}</p>
      </div>

      <div class="entry-actions">
        <span class="status-badge ${
          entry.status === "active" ? "status-active" : "status-completed"
        }">
          ${entry.status}
        </span>

        <button class="done-btn">
          ${entry.status === "active" ? "Mark as Done" : "Mark as Active"}
        </button>

        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    entriesList.appendChild(card);
  });
}

// Reset form
function resetForm() {
  titleInput.value = "";
  descInput.value = "";
  entryIdInput.value = "";
  addBtn.textContent = "Add";
}

// Handle button clicks inside entries (event delegation)
function handleEntryActions(e) {
  const card = e.target.closest(".entry-card");
  if (!card) return;

  const id = Number(card.dataset.id);

  if (e.target.classList.contains("edit-btn")) loadEntryForEdit(id);
  if (e.target.classList.contains("delete-btn")) deleteEntry(id);
  if (e.target.classList.contains("done-btn")) toggleStatus(id);
}

// Save entries to localStorage
function saveEntries() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

// Load entries from localStorage
function loadEntries() {
  const saved = localStorage.getItem("entries");
  if (saved) {
    entries = JSON.parse(saved);
  }
  applyAllFilters();
}