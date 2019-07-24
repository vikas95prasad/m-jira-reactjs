import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Moment from 'react-moment';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { userActions } from '../_actions';
import { userService } from '../_services';

class TodoPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      todos: [],
      projects: [],
      users: [],
      limit: 15,
      offset: 0,
      title: '',
      description: '',
      userId: '',
      status: '',
      projectId: '',
      developerId: '',
      table: true,
      labelWidth: 0,
      fabCreate: true,
      displayStatus: ['todo','in_progress', 'done']
    };
  }

  componentDidMount() {
    // this.props.dispatch(userActions.getAll());
    this.getTodos();
    userService.getProjects().then(projects => {
      if (projects) {
        this.setState({
          projects: projects
        })
      }
    });
    userService.getUsers().then(users => {
      if (users) {
        this.setState({
          users: users
        })
      }
    });
    this.setState({
      table: true,
      fabCreate: true
    });
  }

  getTodos = () => {
    userService.getTodos().then(todos => {
      if (todos) {
        this.setState({
          todos: todos
        })
      }
    });
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };

  onTodoSubmit = () => {
    let payload = {
                    title: this.state.title, 
                    description: this.state.description,
                    developer_id: this.state.developerId,
                    status: this.state.status,
                    project_id: this.state.projectId,
                    due_date: this.state.dueDate
                  }
    userService.createTodo(payload).then(todos => {
      this.setState({ 
        table: true,
        snackBar: true,
        fabCreate: true
      });
      this.getTodos();
    })
  }

  onProjectFab = () => {
    this.setState({
      fabCreate: false,
      table: false
    })
  }

  onTodoChange = (id, from, event) => {
    if (from === 'status') {
      let payload = {status: event.target.value, id: id}
      userService.updateTodoStatus(payload);
      this.state.todos.forEach(function(item){
        if(item.id === id){
          item.status = event.target.value
          return
        }
      });
    }else if(from === 'developer'){
      let user = this.state.users.find(function(user) {
        return user.email === event.target.value;
      });
      let payload = {developer_id: user.id, id: id}
      userService.updateTodoStatus(payload);
      this.state.todos.forEach(function(item){
        if(item.id === id){
          item.developer = event.target.value
          return
        }
      });
    }
    this.setState({ state: this.state });
  };

  render() {
    const { classes, user, users } = this.props;

    return (
      <div className='project-main-div'>
        { this.state.fabCreate &&
          <Fab  color="primary" 
                aria-label="Add"
                style={{position: 'fixed', bottom: '40px', right: '28px'}}
                onClick={this.onProjectFab.bind(this)} 
          >
            <AddIcon />
          </Fab>
        }
        {this.state.table ?
          <Paper className='project-table'>
          <Table className='project-table-width'>
            <TableHead>
              <TableRow>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Developer</TableCell>
                <TableCell align="center">Project</TableCell>
                <TableCell align="center">Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.todos.map(row => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center" className='outlined-select-todo-simple'>
                    <Select
                      value={row.status}
                      onChange={this.onTodoChange.bind(this, row.id, "status")}
                      input={
                        <OutlinedInput
                          labelWidth={this.state.labelWidth}
                          name="age"
                          id="outlined-age-simple"
                          className='outlined-select-todo-simple'
                        />
                      }
                    >{this.state.displayStatus.map(row => (
                      <MenuItem value={row}>{row.toUpperCase()}</MenuItem>
                    ))}
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <Select
                        value={row.developer}
                        onChange={this.onTodoChange.bind(this, row.id, 'developer')}
                        input={
                          <OutlinedInput
                            labelWidth={this.state.labelWidth}
                            name="age"
                            id="outlined-age-simple"
                            className='outlined-select-todo-simple'
                          />
                        }
                      >
                      {this.state.users.map(row => (
                        <MenuItem value={row.email}>{row.email}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell align="center">{row.project}</TableCell>
                  <TableCell align="center"><Moment format="YYYY/MM/DD">{row.created_at}</Moment></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        : 
        <div className='container'>
          <Typography variant="h5" style={{margin: 'auto', marginTop: '14px'}} component="h2" color="textSecondary" gutterBottom>
            CREATE TODO
          </Typography>
          <form className='project-create-form' noValidate autoComplete="off">
            <div>
              <TextField
                id="outlined-name"
                label="Title"
                className='project-text-field'
                value={this.state.name}
                onChange={this.handleChange.bind(this, 'title')}
                margin="normal"
                variant="outlined"
              />
            </div>
            <div>
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows="10"
                onChange={this.handleChange.bind(this, 'description')}
                value={this.state.description}
                defaultValue="Default Value"
                className='project-text-field'
                margin="normal"
                variant="outlined"
              />
            </div>
              <div style={{margin: '5px', marginTop: '15px'}}>
                <div>
                  <InputLabel
                    ref={ref => {
                      this.InputLabelRef = ref;
                    }}
                    htmlFor="outlined-age-simple"
                  >
                    Projects
                  </InputLabel>
                </div>
                <div>
                  <Select
                    value={this.state.projectId}
                    onChange={this.handleChange.bind(this, 'projectId')}
                    input={
                      <OutlinedInput
                        labelWidth={this.state.labelWidth}
                        name="age"
                        id="outlined-age-simple"
                      />
                    }
                  >{this.state.projects.map(row => (
                      <MenuItem value={row.id}>{row.name}</MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div style={{margin: '5px', marginTop: '15px'}}>
                <div>
                  <InputLabel
                    ref={ref => {
                      this.InputLabelRef = ref;
                    }}
                    htmlFor="outlined-age-simple"
                  >
                    Developers
                  </InputLabel>
                </div>
                <div>
                  <Select
                    value={this.state.developerId}
                    onChange={this.handleChange.bind(this, 'developerId')}
                    input={
                      <OutlinedInput
                        labelWidth={this.state.labelWidth}
                        name="age"
                        id="outlined-age-simple"
                      />
                    }
                  >{this.state.users.map(row => (
                    <MenuItem value={row.id}>{row.email}</MenuItem>
                  ))}
                  </Select>
                </div>
                </div>
                <div style={{margin: '5px', marginTop: '15px'}}>
                  <div>
                    <InputLabel
                      ref={ref => {
                        this.InputLabelRef = ref;
                      }}
                      htmlFor="outlined-age-simple"
                    >
                      Status
                    </InputLabel>
                  </div>
                  <div>
                    <Select
                      value={this.state.status}
                      onChange={this.handleChange.bind(this, 'status')}
                      input={
                        <OutlinedInput
                          labelWidth={this.state.labelWidth}
                          name="age"
                          id="outlined-age-simple"
                        />
                      }
                    >{this.state.displayStatus.map(row => (
                      <MenuItem value={row}>{row}</MenuItem>
                    ))}
                    </Select>
                  </div>
              </div>
              <div style={{margin: '5px'}}>
                <TextField
                  id="due-date"
                  label="Due Date"
                  type="date"
                  defaultValue="2017-05-24"
                  className="project-text-field"
                  value={this.state.dueDate}
                  onChange={this.handleChange.bind(this, 'dueDate')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            <div style={{margin: '8px'}}>
              <Button variant="contained" color="primary" styles={{ margin: '10px'}} onClick={this.onTodoSubmit.bind(this)}>
                Submit
              </Button>
            </div>
        </form>
      </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return {
    user,
    users
  };
}

const connectedTodoPage = connect(mapStateToProps)(TodoPage);
export { connectedTodoPage as TodoPage };