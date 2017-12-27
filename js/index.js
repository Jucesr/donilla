//Global state

var state = {
  username: window.localStorage.getItem('username') || '',
  error_message: '',
  is_inserting_todo: false,
  is_editing_todo: false,
  todo_selected_id: '',
  todos: fetchTodos(),
  text_filter: '',
  status_filter: 'all'
};

var DOM__username = document.getElementById('username');
var DOM__username_input = document.querySelector('[name=username_input]');
var DOM__todo_list = document.getElementById('todo_list');
var DOM__error_message = document.getElementById('error_message');
var DOM__error_container = document.getElementById('error-container');
var DOM__todos_main = document.getElementById('todos_main');
var DOM__add_todo_btn = document.getElementById('add_todo_btn');
var DOM__save_todo_form = document.getElementById('save_todo_form');
var DOM__log_in = document.getElementById('log_in');
var DOM__log_out = document.getElementById('log_out');
var DOM__todo_title_input = document.querySelector('[name="todo_title"]');
var DOM__text_filter_input = document.querySelector('[name="text_filter_input"]');
var DOM__status_filter_select = document.getElementById('status_filter_select');


var TODO_ID_INDEX = 0;
var TODO_INFO_INDEX = 0;
var TODO_CONTROLS_INDEX = 1;

// ----------------------RENDERS----------------------

function renderUserInfo(){
  if(state.username){
    DOM__log_in.style.display = 'none';
    DOM__log_out.style.display = 'flex';
    DOM__username.innerHTML = state.username;

  }else{
    DOM__log_in.style.display = 'flex';
    DOM__log_out.style.display = 'none';
  }
}

function renderTodoList(){

  DOM__todos_main.style.display = 'block';

  var todos = state.todos;

  if(state.username){

    todos = filterTodosByUser(todos, state.username);

    if(todos.length > 0){

      //Aply filters
      todos = filterTodosByText(todos, state.text_filter);
      todos = filterTodosByStatus(todos, state.status_filter);

      DOM__todo_list.innerHTML = createTodoItems(todos);

    }else{
      state.error_message = 'Empty list, please add a new todo';
      DOM__todo_list.innerHTML = '';
    }
  }else{
    DOM__todos_main.style.display = 'none';
  }


}

function renderErrorMessage(){

  if(state.error_message){
    DOM__error_container.style.display = 'block';
    DOM__error_message.innerHTML = state.error_message;
  }else{
    DOM__error_container.style.display = 'none';
  }

  state.error_message = '';
}

function renderAddTodo(){
  if(state.is_inserting_todo){
    DOM__add_todo_btn.style.display = 'none';
    DOM__save_todo_form.style.display = 'flex';
    DOM__todo_title_input.focus();
  }else{
    DOM__add_todo_btn.style.display = 'block';
    DOM__save_todo_form.style.display = 'none';
  }

}

function render(){
  renderUserInfo();
  renderTodoList();
  renderErrorMessage();
  renderAddTodo();
}

// ----------------------EVEN HANDLERS----------------------

function add_todo_handler(e){
  state.is_inserting_todo = true;
  render();
}

function log_in_handler(e){
  var username = DOM__username_input.value.trim();

  if(validInput(username)){
    window.localStorage.setItem('username', username);
    state.username = username;

  }else{
    state.error_message = 'The user is invalid, please try again.'

  }
  render();
}

function log_out_handler(e){
  window.localStorage.setItem('username', '');
  state.username = '';

  render();
}

function status_filter_handler(e){
  var status_filter = DOM__status_filter_select.value;
  state.status_filter = status_filter;
  renderTodoList();
}

function save_todo_handler(e){
  var todo_title = DOM__todo_title_input.value.trim();

  if(validInput(todo_title)){
    state.todos.push({
      id: getUniqueID(),
      title: todo_title,
      createdBy: state.username,
      createdAt: getTime(),
      status: false
    });
    state.is_inserting_todo = false;
    DOM__todo_title_input.value = '';

    saveTodos(state.todos);

  }else{
    state.error_message = 'You must type something';
  }
  render();

  e.preventDefault();
}

function text_filter_handler(e){
  var text_filter = DOM__text_filter_input.value;
  state.text_filter = text_filter.toLowerCase();
  renderTodoList();
}

function edit_todo_handler(element){
  if(!state.is_editing_todo){
    element.children[TODO_CONTROLS_INDEX].style.display = 'block';
    state.is_editing_todo = true;
    state.todo_selected_id = element.children[TODO_INFO_INDEX].children[TODO_ID_INDEX].innerHTML;
  }
}

function remove_todo_hanlder(e){
  state.todos = removeTodoByID(state.todos, state.todo_selected_id);
  state.is_editing_todo = false;
  state.todo_selected_id = '';
  saveTodos(state.todos);
  render();
  e.stopPropagation();

}

function mark_done_todo_handler(e){
  state.todos = changeTodoStateByID(state.todos, state.todo_selected_id, true);
  state.is_editing_todo = false;
  state.todo_selected_id = '';
  saveTodos(state.todos);
  render();
  e.stopPropagation();
}

function mark_pending_todo_handler(e){
  state.todos = changeTodoStateByID(state.todos, state.todo_selected_id, false);
  state.is_editing_todo = false;
  state.todo_selected_id = '';
  saveTodos(state.todos);
  render();
  e.stopPropagation();
}

function cancel_edit_hanlder(e){

  setTimeout(function(){
    if(document.activeElement == e){
      state.is_editing_todo = false;
      state.todo_selected_id = '';
      renderTodoList();
    }
  },0)

}

// ----------------------ACTIONS----------------------

function filterTodosByText(todos, text_filter){
  return todos.filter(function(todo){
    return todo.title.toLowerCase().includes(text_filter)
  });
}

function filterTodosByStatus(todos, status_filter){

  if(status_filter === 'all'){
    return todos
  }

  return todos.filter(function(todo){
    var status = status_filter === 'done' ? true : false;
    return todo.status === status;
  });
}

function filterTodosByUser(todos, username){
  return todos.filter(function(todo){
    return todo.createdBy == username;
  });
}

function removeTodoByID(todos, id){
  return todos.filter(function(todo){
    return todo.id != id;
  });
}

function changeTodoStateByID(todos, id, newState){
  todos.map(function(todo){
    if (todo.id == id)
      todo.status = newState;
  });

  return todos;
}

function fillTodoArray(limit){

  for (var i = 0; i < limit; i++) {
    state.todos.push({
      id: getUniqueID(),
      title: `Test${i}`,
      createdBy: 'PC',
      createdAt: getTime(),
      status: false
    });
  }
  renderTodoList();
}

function saveTodos(todos){
  window.localStorage.setItem('todos', JSON.stringify(todos));
}

function fetchTodos(){
  var todos = window.localStorage.getItem('todos')
  if (todos)
    return JSON.parse(todos);
  else
    return []
}

// ----------------------HELPERS----------------------

function getTime(){
  //Wed Dec 13 2017 10:39:00 GMT-0800 (Pacific Standard Time)
  return new Date().toString().split(' ').slice(1,3).join(' ');;
}

function validInput(input){
  return input.trim().length > 0 ? true : false
}

function getUniqueID () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

function createTodoItems(todos){
  var id, title, createdBy, createdAt, status, remove, update, title_createdBy, todo_controls;
  var todo_elements = '';

  todos.map(function(todo) {
    id = `<span style="display:none;">${todo.id}</span>`;
    title = `<div class="todo_title">${todo.title}</div>`;
    createdAt = `<div class="todo_date">${todo.createdAt}</div>`;
    status = `<img class="todo_status" width"50" height="50" src="../img/${todo.status ? 'done.png':'pending.png'}"/>`;
    remove = '<button class="todo_btn remove" onclick="remove_todo_hanlder(event)">Remove</button>';
    update = `<button class="todo_btn update" onclick="${todo.status ? 'mark_pending_todo_handler(event)':'mark_done_todo_handler(event)'}" >Mark ${todo.status ? 'pending':'done'}</button>`;

    title_createdBy = `<div class="todo_title_date">${title + createdAt}</div>`;
    todo_controls = `<div id="modal" class="modal"> ${remove + update}</div>`;

    todo_elements += `<div tabindex="0" class="todo_item" id="todo_item" onclick = "edit_todo_handler(this)" onmouseleave=cancel_edit_hanlder(this) > <div class="todo_item_info"> ${id + title_createdBy + status}</div> <div class="todo_item_controls" style="display:none;"> ${todo_controls} </div> </div>`;

  });

  return todo_elements;
}

// ---------------------- MAIN ----------------------

render();
