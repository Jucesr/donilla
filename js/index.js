//Global state

var state = {
  isInsertingNew: false,
  todos: [],
  text_filter: '',
  status_filter: 'all'
};

var username__dom = document.getElementById('username');
var todo_list__dom = document.getElementById('todo_list');
var sign = document.getElementById('sign_btn');
var add_todo = document.getElementById('add_todo');

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
  var title, createdBy, createdAt, finished;
  var todo_elements = '';
  var todos = state.todos;
  //Aply filters

  todos = filterTodosByText(todos, state.text_filter);
  todos = filterTodosByStatus(todos, state.status_filter);

  todos.map(function(todo) {
    title = `<div>${todo.title}<div>`;
    createdBy = `<div>${todo.createdBy}<div>`;
    createdAt = `<div>${todo.createdAt}<div>`;
    finished = `<img width"50" height="50" src="../img/${todo.finished ? 'done.png':'pending.png'}"/>`;

    todo_elements += `<div>${title + createdBy + createdAt +finished}<div>`;

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
      if(!state.isInsertingNew){
        state.isInsertingNew = true;
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
            title: todo_title,
            createdBy: username,
            createdAt: getTime(),
            finished: false
          });
          state.isInsertingNew = false;
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
