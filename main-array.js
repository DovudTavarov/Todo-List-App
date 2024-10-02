const mainEl = document.querySelector("main"),
  newTodoInput = document.querySelector("#new-todo-input"),
  addTodoBtn = document.querySelector("#add-todo");

function getLocalStorage() {
  const parsedStorage = JSON.parse(localStorage.getItem("todos"));

  return parsedStorage != null ? parsedStorage : [];
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

function createSingleTodo(todoParam) {
  const editMode = editId == todoParam.id;
  const customClass = todoParam.completed
    ? "form-control line-thru"
    : "form-control";

  const newTodo = `<div class="input-group mb-1">
                      <span class="input-group-text">
                        ${
                          todoParam.completed
                            ? `<input checked onclick="eachTodoActionFns.checkEachTodoFn('${todoParam.id}')" type="checkbox" />`
                            : `<input onclick="eachTodoActionFns.checkEachTodoFn('${todoParam.id}')" type="checkbox" />`
                        }
                      </span>
                      ${
                        editMode
                          ? `<input
                              id="input-${todoParam.id}"
                              type="text"
                              class="${customClass}"
                              value="${todoParam.text}"
                            />
                            <button onclick="eachTodoActionFns.saveEachTodoFn('${todoParam.id}')" class="btn btn-warning" type="button">
                              Save
                            </button>`
                          : `<input
                              disabled
                              type="text"
                              class="${customClass}"
                              value="${todoParam.text}"
                            />
                            <button onclick="eachTodoActionFns.editEachTodoFn('${todoParam.id}')" class="btn btn-secondary" type="button">
                              Edit
                            </button>`
                      }
                      <button onclick="eachTodoActionFns.deleteEachTodoFn('${
                        todoParam.id
                      }')" class="btn btn-danger" type="button">
                        Delete
                      </button>
                    </div>
                    `;
  mainEl.innerHTML += newTodo;
}

function saveEachTodoFn(id) {
  const inputElem = document.querySelector(`#input-${editId}`);

  todos.forEach((todo) => {
    if (todo.id == editId) {
      todo.text = inputElem.value;
    }
  });

  editId = null;

  updateLocalStorage(todos);
  createTodoListView();
}

function editEachTodoFn(id) {
  editId = id;

  createTodoListView();
}

function deleteEachTodoFn(id) {
  const newTodosArr = todos.filter((todo) => todo.id != id);

  todos = newTodosArr;

  updateLocalStorage(todos);
  createTodoListView();
}

function checkEachTodoFn(id) {
  todos.forEach((todo) => {
    if (todo.id == id) {
      todo.completed = !todo.completed;
    }
  });

  updateLocalStorage(todos);
  createTodoListView();
}

function createTodoListView() {
  mainEl.innerHTML = "";

  for (let todo of todos) {
    createSingleTodo(todo);
  }
}

createTodoListView();

addTodoBtn.addEventListener("click", () => {
  const value = newTodoInput.value.trim();

  if (value !== "") {
    const newId = Math.random().toString(16).slice(2);

    const newTodo = {
      id: newId,
      text: value,
      completed: false,
    };

    todos.push(newTodo);

    updateLocalStorage(todos);
    createTodoListView();
  } else {
    console.log("Please add a text.");
  }

  newTodoInput.value = "";
});
