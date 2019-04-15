import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { unstable_Box as Box } from '@material-ui/core/Box';
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
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import { userActions } from '../_actions';
import { userService } from '../_services';

class ProjectPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projects: [],
      table: true,
      name: '',
      description: '',
      limit: 15,
      offset: 0,
      dueDate: '',
      status: '',
      displayStatus: ['active', 'complete'],
      fabCreate: true
    };
  }

  componentDidMount() {
    // this.props.dispatch(userActions.getAll());
    this.getProjects();
  }

  getProjects = () => {
    userService.getProjects().then(projects => {
      if (projects) {
        this.setState({
          projects: projects
        })
      }
    });
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };

  onProjectSubmit = () => {
    let payload = { name: this.state.name, 
                    description: this.state.description, 
                    due_date: this.state.dueDate, 
                    status: this.state.status }
    userService.createProject(payload).then(projects => {
      this.setState({ 
        table: true,
        snackBar: true,
        fabCreate: true
      });
    })
    this.getProjects();
  }

  onProjectFab = () => {
    this.setState({
      fabCreate: false,
      table: false
    })
  }

  render() {
      const { user, users } = this.props;
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
            <div>
              <Paper className='project-table'>
                <Table className='project-table-width'>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Name</TableCell>
                      <TableCell align="right">Description</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Created At</TableCell>
                      <TableCell align="right">Updated AT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.projects.map(row => (
                      <TableRow key={row.id}>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell align="right">{row.description}</TableCell>
                        <TableCell align="right">{row.status}</TableCell>
                        <TableCell align="right"><Moment format="YYYY/MM/DD">{row.created_at}</Moment></TableCell>
                        <TableCell align="right"><Moment format="YYYY/MM/DD">{row.updated_at}</Moment></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div> : 
            <div className='container'>
                <Typography variant="h5" style={{margin: 'auto', marginTop: '14px'}} component="h2" color="textSecondary" gutterBottom>
                  CREATE PROJECT
                </Typography>
              <form className='project-create-form' noValidate autoComplete="off">
                <div>
                  <TextField
                    id="outlined-name"
                    label="Name"
                    className='project-text-field'
                    value={this.state.name}
                    onChange={this.handleChange.bind(this, 'name')}
                    margin="normal"
                    variant="outlined"
                  />
                </div>
                <div>
                  <TextField
                    id="outlined-multiline-static"
                    label="Multiline"
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
                <div>
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
                <div style={{padding: '5px'}}>
                  <InputLabel
                    ref={ref => {
                      this.InputLabelRef = ref;
                    }}
                    htmlFor="outlined-age-simple"
                    className='project-text-field'
                  >
                    Status
                  </InputLabel>
                </div>
                <div style={{marginTop: '3px', marginBottom: '10px'}}>
                  <Select
                    value={this.state.status}
                    margin="normal"
                    className='project-select-field'
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
                <div>
                  <Button variant="contained" color="primary" styles={{ margin: '10px'}} onClick={this.onProjectSubmit.bind(this)}>
                  Submit
                  </Button>
                </div>
              </form>
            </div>
          }
        </div>
      );
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

const connectedProjectPage = connect(mapStateToProps)(ProjectPage);
export { connectedProjectPage as ProjectPage };