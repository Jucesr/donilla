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

var username__dom = document.getElementById('username');
var todo_list__dom = document.getElementById('todo_list');
var error_message__dom = document.getElementById('error_message');
var error_container__dom = document.getElementById('error-container');
var todos_main__dom = document.getElementById('todos_main');
var add_todo_btn__dom = document.getElementById('add_todo_btn');
var save_todo_form__dom = document.getElementById('save_todo_form');


var TODO_ID_INDEX = 0;
var TODO_INFO_INDEX = 0;
var TODO_CONTROLS_INDEX = 1;
var TODO_DELETE_BUTTON_INDEX = 0;
var TODO_UPDATE_BUTTON_INDEX = 1;
var TODO_CANCEL_BUTTON_INDEX = 2;

// ----------------------RENDERS----------------------

function renderUserInfo(){
  if(state.username){
    document.getElementById('log_in').style.display = 'none';
    document.getElementById('log_out').style.display = 'flex';
    username__dom.innerHTML = state.username;

  }else{
    document.getElementById('log_in').style.display = 'flex';
    document.getElementById('log_out').style.display = 'none';
  }
}

function renderTodoList(){

  todos_main__dom.style.display = 'block';

  var todos = state.todos;

  if(state.username){

    todos = filterTodosByUser(todos, state.username);

    if(todos.length > 0){
      var id, title, createdBy, createdAt, finished, remove, update, title_createdBy, todo_controls;
      var todo_elements = '';
      //Aply filters

      todos = filterTodosByText(todos, state.text_filter);
      todos = filterTodosByStatus(todos, state.status_filter);

      todos.map(function(todo) {
        id = `<span style="display:none;">${todo.id}</span>`
        title = `<div class="todo_title">${todo.title}</div>`;
        createdAt = `<div class="todo_date">${todo.createdAt}</div>`;
        finished = `<img class="todo_status" width"50" height="50" src="../img/${todo.finished ? 'done.png':'pending.png'}"/>`;
        remove = '<button class="todo_btn remove" onclick="remove_todo_hanlder(event)">Remove</button>';
        update = `<button class="todo_btn update" onclick="${todo.finished ? 'mark_undone_todo_handler(event)':'mark_done_todo_handler(event)'}" >Mark ${todo.finished ? 'undone':'done'}</button>`;

        title_createdBy = `<div class="todo_title_date">${title + createdAt}</div>`;
        todo_controls = `<div id="modal" class="modal"> ${remove + update}</div>`;

        todo_elements += `<div tabindex="0" class="todo_item" id="todo_item" onclick = "edit_todo_handler(this)" onmouseleave=cancel_edit_hanlder(this) > <div class="todo_item_info"> ${id + title_createdBy +finished}</div> <div class="todo_item_controls" style="display:none;"> ${todo_controls} </div> </div>`;

      });
      todo_list__dom.innerHTML = todo_elements;

    }else{
      state.error_message = 'Empty list, please add a new todo';
      todo_list__dom.innerHTML = '';
    }
  }else{
    state.error_message = 'You must log in to see your todos';
    todos_main__dom.style.display = 'none';
  }


}

function renderErrorMessage(){

  if(state.error_message){
    error_container__dom.style.display = 'block';
    error_message__dom.innerHTML = state.error_message;
  }else{
    error_container__dom.style.display = 'none';
  }

  state.error_message = '';
}

function renderAddTodo(){
  if(state.is_inserting_todo){
    add_todo_btn__dom.style.display = 'none';
    save_todo_form__dom.style.display = 'flex';
    document.querySelector('[name="todo_title"]').focus();
  }else{
    add_todo_btn__dom.style.display = 'block';
    save_todo_form__dom.style.display = 'none';
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
  var username = document.querySelector('[name=username_input]').value.trim();

  if(validInput(username)){
    window.localStorage.setItem('username', username);
    state.username = username;
    render();
  }else{
    state.error_message = 'The user is invalid, please try again.'

  }
}

function log_out_handler(e){
  window.localStorage.clear();
  state.username = '';

  render();
}

function status_filter_handler(e){
  var status_filter = document.getElementById('status_filter_select').value;
  state.status_filter = status_filter;
  renderTodoList();
}

function save_todo_handler(e){
  var todo_title = document.querySelector('[name="todo_title"]').value.trim();

  if(validInput(todo_title)){
    state.todos.push({
      id: getUniqueID(),
      title: todo_title,
      createdBy: state.username,
      createdAt: getTime(),
      finished: false
    });
    state.is_inserting_todo = false;
    document.querySelector('[name="todo_title"]').value = '';

    saveTodos(state.todos);

  }else{
    state.error_message = 'You must type something';
  }
  render();

  e.preventDefault();
}

function text_filter_handler(e){
  var text_filter = document.querySelector('[name="text_filter_input"]').value;
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
  renderTodoList();
  e.stopPropagation();
}

function mark_undone_todo_handler(e){
  state.todos = changeTodoStateByID(state.todos, state.todo_selected_id, false);
  state.is_editing_todo = false;
  state.todo_selected_id = '';
  saveTodos(state.todos);
  renderTodoList();
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


// ----------------------UTILIS----------------------

function getTime(){
  //Wed Dec 13 2017 10:39:00 GMT-0800 (Pacific Standard Time)
  return new Date().toString().split(' ').slice(1,3).join(' ');;
}

function validInput(input){
  return input.trim().length > 0 ? true : false
}

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
    var finished = status_filter === 'done' ? true : false;
    return todo.finished === finished;
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
      todo.finished = newState;
  });

  return todos;
}

function getUniqueID () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

function fillTodoArray(limit){

  for (var i = 0; i < limit; i++) {
    state.todos.push({
      id: getUniqueID(),
      title: `Test${i}`,
      createdBy: 'PC',
      createdAt: getTime(),
      finished: false
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


// ---------------------- MAIN ----------------------

render();
