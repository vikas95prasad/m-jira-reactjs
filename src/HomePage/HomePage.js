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
import Collapse from '@material-ui/core/Collapse';
import StarBorder from '@material-ui/icons/StarBorder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ShopTwo from '@material-ui/icons/ShopTwo';


import { userActions } from '../_actions';

class HomePage extends React.Component {
    state = {
      dashboard: "Dashboard",
      left: false
    };

    componentDidMount() {
      this.props.dispatch(userActions.getAll());
    }

    onProjectClick = () => {
      this.props.history.push('/projects')
    }

    toggleDrawer = (side, open) => () => {
      this.setState({
        [side]: open
      });
    };

    handleClick = () => {
      this.setState(state => ({ open: !state.open }));
    };

    onListClick = (name) => {
      console.log(name);
    }

    render() {
        const { user, users } = this.props;
        const sideList = (
          <div className='side-bar'>
            <Divider />
            <List >
              <ListItem button component={Link} to="/">
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary="Home"/>
              </ListItem>
              <Divider />
              <ListItem button component={Link} to="/projects" style={{paddingLeft: '20px'}}>
                <ListItemIcon>
                  <ShopTwo />
                </ListItemIcon>
                <ListItemText inset primary="Projects" />
              </ListItem>
              <Divider />
              <ListItem button component={Link} to="/todos">
                <ListItemIcon><MailIcon /></ListItemIcon>
                <ListItemText primary="Todos" />
              </ListItem>
            </List>
            <Divider />
          </div>
        );

        return (
          <div>
            {localStorage.getItem('user') && 
                <div className='app-header'>
                  <div>
                    <AppBar position="static">
                      <Toolbar>
                        <IconButton className='app-header-menuButton' onClick={this.toggleDrawer('left', true)} color="inherit" aria-label="Menu">
                          <MenuIcon />
                        </IconButton>
                        <div style={{flex: 'auto'}}>
                          <Typography variant="h6" color="inherit" className='app-header'>
                            {this.state.dashboard}
                          </Typography>
                        </div>
                        <div>
                          <Button color="inherit">
                            <Link style={{color: 'white', textDecoration: 'none'}} to="/login">Log Out</Link>
                          </Button>
                        </div>
                      </Toolbar>
                    </AppBar>
                  </div>
                  <div>
                    <SwipeableDrawer
                      open={this.state.left}
                      onClose={this.toggleDrawer('left', false)}
                      onOpen={this.toggleDrawer('left', true)}
                    >
                      <div  tabIndex={0}
                            role="button"
                            onClick={this.toggleDrawer('left', false)}
                            onKeyDown={this.toggleDrawer('left', false)}
                            style={{width: '250px', marginTop: '73px'}} >
                            {sideList}
                      </div>
                    </SwipeableDrawer>
                  </div>
              </div>
            }
          </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    const { user } = authentication;
    return {
      user
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };