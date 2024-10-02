const mainEl = document.querySelector("main");
const newTodoInput = document.querySelector("#new-todo-input");
const addTodoBtn = document.querySelector("#add-todo");

function getLocalStorage() {
  const parsedStorage = JSON.parse(localStorage.getItem("todos"));

  return parsedStorage !== null ? parsedStorage : {};
}

function updateLocalStorage(newTodos) {
  localStorage.setItem("todos", JSON.stringify(newTodos));
}

let todos = getLocalStorage();

let editId = null;

window.eachTodoActionFns = {
  checkEachTodoFn,
  deleteEachTodoFn,
  editEachTodoFn,
  saveEachTodoFn,
};

function createSingleTodo(id, todoParam) {
  const editMode = editId == id;
  const customClass = todoParam.completed
    ? "form-control line-thru"
    : "form-control";

  const newTodo = `<div class="input-group mb-1">
                      <span class="input-group-text">
                        ${
                          todoParam.completed
                            ? `<input checked onclick="eachTodoActionFns.checkEachTodoFn('${id}')" type="checkbox" />`
                            : `<input onclick="eachTodoActionFns.checkEachTodoFn('${id}')" type="checkbox" />`
                        }
                      </span>
                      ${
                        editMode
                          ? `<input
                              id="input-${id}"
                              type="text"
                              class="${customClass}"
                              value="${todoParam.text}"
                            />
                            <button onclick="eachTodoActionFns.saveEachTodoFn('${id}')" class="btn btn-warning" type="button">
                              Save
                            </button>`
                          : `<input
                              disabled
                              type="text"
                              class="${customClass}"
                              value="${todoParam.text}"
                            />
                            <button onclick="eachTodoActionFns.editEachTodoFn('${id}')" class="btn btn-secondary" type="button">
                              Edit
                            </button>`
                      }
                      <button onclick="eachTodoActionFns.deleteEachTodoFn('${id}')" class="btn btn-danger" type="button">
                        Delete
                      </button>
                    </div>
                    `;
  mainEl.innerHTML += newTodo;
}

function saveEachTodoFn(id) {
  const inputElem = document.querySelector(`#input-${editId}`);

  todos[editId].text = inputElem.value;

  editId = null;
  updateLocalStorage(todos);
  createTodoListView();
}

function editEachTodoFn(id) {
  editId = id;

  createTodoListView();
}

function deleteEachTodoFn(id) {
  delete todos[id];
  updateLocalStorage(todos);
  createTodoListView();
}

function checkEachTodoFn(id) {
  todos[id].completed = !todos[id].completed;
  updateLocalStorage(todos);
  createTodoListView();
}

function createTodoListView() {
  mainEl.innerHTML = "";

  for (let key in todos) {
    createSingleTodo(key, todos[key]);
  }
}

createTodoListView();

addTodoBtn.addEventListener("click", () => {
  const value = newTodoInput.value.trim();

  if (value !== "") {
    const newId = Math.random().toString(16).slice(2);

    const newTodo = {
      text: value,
      completed: false,
    };

    todos[newId] = newTodo;
    updateLocalStorage(todos);
    createTodoListView();
  } else {
    console.log("Please add a text.");
  }

  newTodoInput.value = "";
});
