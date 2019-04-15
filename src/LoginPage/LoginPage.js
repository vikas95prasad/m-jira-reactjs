import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'

import { userActions } from '../_actions';

class LoginPage extends React.Component {
    constructor(props) {
      super(props);
      // reset login status
      this.props.dispatch(userActions.logout());

      this.state = {
          username: '',
          password: '',
          submitted: false
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit() {
      this.setState({ submitted: true });
      const { username, password } = this.state;
      const { dispatch } = this.props;
      if (username && password) {
        dispatch(userActions.login(username, password));
      }
    }

    render() {
        const { loggingIn } = this.props;
        const { username, password, submitted } = this.state;
        return (
            <Paper className="login-form">
                <div className="login-username">
                  <Grid container spacing={8} alignItems="flex-end">
                      <Grid item>
                      <Face />
                      </Grid>
                      <Grid item md={true} sm={true} xs={true}>
                      <TextField
                          id="userEmail"
                          name='username'
                          label="User Email"
                          type="email"
                          fullWidth
                          autoFocus
                          required
                          value={this.state.username}
                          onChange={this.handleChange.bind(this)}
                      />
                      </Grid>
                  </Grid>
                  <Grid container spacing={8} alignItems="flex-end">
                      <Grid item>
                      <Fingerprint />
                      </Grid>
                      <Grid item md={true} sm={true} xs={true}>
                      <TextField
                          id="userPassword"
                          name='password'
                          label="Password"
                          type="password"
                          fullWidth
                          required
                          value={this.state.password}
                          onChange={this.handleChange.bind(this)}
                      />
                      </Grid>
                  </Grid>
                  <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                        <FormControlLabel control={
                            <Checkbox
                            color="primary"
                            />
                        } label="Remember me" />
                      </Grid>
                      <Grid item>
                        <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
                      </Grid>
                  </Grid>
                  <Grid container justify="center" style={{ marginTop: '10px' }}>
                      <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleSubmit.bind(this)}>Login</Button>
                  </Grid>
                </div>
            </Paper>
        );
    }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  return {
    loggingIn
  };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage }; 