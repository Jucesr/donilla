//Global state

var state = {
  isInsertTodo: false,
  isEditingTodo: false,
  todos: [],
  todo_selected_id: '',
  text_filter: '',
  status_filter: 'all'
};

var username__dom = document.getElementById('username');
var todo_list__dom = document.getElementById('todo_list');
var sign = document.getElementById('sign_btn');
var add_todo = document.getElementById('add_todo');

var TODO_ID_INDEX = 0;
var TODO_DELETE_BUTTON_INDEX = 5;
var TODO_UPDATE_BUTTON_INDEX = 6;

// ----------------------RENDERS----------------------

function renderUserInfo(){
  var username = window.localStorage.getItem('username');
  if(username){
    username__dom.innerHTML = username;
    sign.innerHTML = 'Cerrar Sesion';
  }else{
    username__dom.innerHTML = 'Anonimo';
    sign.innerHTML = 'Iniciar Sesion';
  }
}

function renderTodoList(){
  var id, title, createdBy, createdAt, finished, remove, update;
  var todo_elements = '';
  var todos = state.todos;
  //Aply filters

  todos = filterTodosByText(todos, state.text_filter);
  todos = filterTodosByStatus(todos, state.status_filter);

  todos.map(function(todo) {
    id = `<span style="display:none;">${todo.id}</span>`
    title = `<div>${todo.title}</div>`;
    createdBy = `<div>${todo.createdBy}</div>`;
    createdAt = `<div>${todo.createdAt}</div>`;
    finished = `<img width"50" height="50" src="../img/${todo.finished ? 'done.png':'pending.png'}"/>`;
    remove = '<button onclick="remove_todo_hanlder()" style="display:none;">Borrar</button>';
    update = '<button style="display:none;">Guardar</button>';

    todo_elements += `<div style="border: 1px solid black;" onclick = "edit_todo_handler(this)" >${id + title + createdBy + createdAt +finished + remove + update}</div>`;

  });
  todo_list__dom.innerHTML = todo_elements;
}

renderUserInfo();

// ----------------------EVEN LISTENERS----------------------

document.addEventListener('click', function(e) {

  switch (e.target.id) {

    case 'sign_btn':
      var username = window.localStorage.getItem('username');

      if(username){
        window.localStorage.clear();
      }else{
        window.localStorage.setItem('username', 'Julio');
      }
      renderUserInfo();
    break;

    case 'add_todo_btn':
      if(!state.isInsertTodo){
        state.isInsertTodo = true;
        var input_field = document.createElement('input');
        var form = '<form id="save_todo_form"><input name="todo_title"/> <button>Guardar</button></form>';
        todo_list__dom.innerHTML = todo_list__dom.innerHTML + form;
        document.querySelector('[name="todo_title"]').focus();
      }
    break;

    default:

  }
});

document.addEventListener('submit', function(e) {
  switch (e.target.id) {
    case 'save_todo_form':
        var todo_title = document.querySelector('[name="todo_title"]').value.trim();
        var username = window.localStorage.getItem('username') || 'Anonimo';


        if(validInput(todo_title)){
          state.todos.push({
            id: getUniqueID(),
            title: todo_title,
            createdBy: username,
            createdAt: getTime(),
            finished: false
          });
          state.isInsertTodo = false;
          document.querySelector('[name="todo_title"]').value = '';
          renderTodoList(state.todos);
        }

    break;
  }
  e.preventDefault();
});

document.querySelector('[name="text_filter_ipt"]').addEventListener('input', function() {
  var text_filter = document.querySelector('[name="text_filter_ipt"]').value;
  state.text_filter = text_filter;
  renderTodoList();
});

document.getElementById('status_filter_select').addEventListener('change', function(){
  var status_filter = document.getElementById('status_filter_select').value;
  state.status_filter = status_filter;
  renderTodoList();
});

// Dynamic elemts

function edit_todo_handler(element){

  if(!state.isEditingTodo){
    console.log('Adelante');
    element.children[TODO_DELETE_BUTTON_INDEX].style.display = 'block';
    element.children[TODO_UPDATE_BUTTON_INDEX].style.display = 'block';
    state.isEditingTodo = true;
    state.todo_selected_id = element.children[TODO_ID_INDEX].innerHTML;
  }else{
    console.log('No se puede editar');
  }
}

function remove_todo_hanlder(){
  state.todos = removeTodoByID(state.todos, state.todo_selected_id);
  state.isEditingTodo = false;
  state.todo_selected_id = '';
  renderTodoList();

}


// ----------------------UTILIS----------------------

function getTime(){
  //Wed Dec 13 2017 10:39:00 GMT-0800 (Pacific Standard Time)
  return new Date().toString().split(' ').slice(1,5).join(' ');;
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

function removeTodoByID(todos, id){
  return todos.filter(function(todo){
    return todo.id != id;
  });
}

function getUniqueID () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};
