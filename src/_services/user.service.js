import { authHeader } from '../_helpers';
var axios = require('axios')

let apiHost = 'http://' + (process.env.API_HOST || 'localhost') + ':5000'

let jwt = false
if (localStorage.getItem('user')){
  jwt = JSON.parse(localStorage.getItem('user')).token
}

export const userService = {
    login,
    logout,
    getAll,
    getProjects,
    createProject,
    getTodos,
    createTodo,
    getUsers
};

//####### Start Users API #######

function getUsers(payload){
  var config = {
    headers: {},
    payload
  }
  if (jwt) {
    config['headers']['Authorization'] = 'Bearer ' + jwt
  }
  return axios.get(apiHost + '/api/users', config)
    .then(function(response){
      return response.data
    })
    .catch(function (error) {
      return undefined
  })
}

//####### End Users API #######


//####### Start Login API #######
function login(username, password) {
    let data = {
      email: username,
      password: password
    }
    return axios.post(apiHost + '/api/users/login', data)
      .then(function (response) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      })
      .catch(function (error) {
        return undefined
      })
}

function logout() {
  localStorage.removeItem('user');
}

//####### End Login API #######


//####### Start Project API #######
function getProjects(payload) {
  var config = {
    headers: {}
  }
  if (jwt) {
    config['headers']['Authorization'] = 'Bearer ' + jwt
  }
  return axios.get(apiHost + '/api/projects', config)
    .then(function(response){
      return response.data
    })
    .catch(function (error) {
      return undefined
  })
}

function createProject(payload) {
  let config = {
    headers: {}
  }
  if (jwt) {
    config['headers']['Authorization'] = 'Bearer ' + jwt
  }
  return axios.post(apiHost + '/api/projects', payload, config)
    .then(function(response){
      return response.data
    })
    .catch(function (error) {
      return undefined
  })
}

//####### End Project API #######

//####### Start Todo API #######

function getTodos(payload) {
  var config = {
    headers: {}
  }
  if (jwt) {
    config['headers']['Authorization'] = 'Bearer ' + jwt
  }
  return axios.get(apiHost + '/api/todos', config)
    .then(function(response){
      return response.data.todos
    })
    .catch(function (error) {
      return undefined
  })
}

function createTodo(payload) {
  let config = {
    headers: {}
  }
  if (jwt) {
    config['headers']['Authorization'] = 'Bearer ' + jwt
  }
  return axios.post(apiHost + '/api/todos', payload, config)
    .then(function(response){
      return response.data
    })
    .catch(function (error) {
      return undefined
  })
}

//####### End Todo API #######







function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                // location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}