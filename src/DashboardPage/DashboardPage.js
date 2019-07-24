import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Chart from 'react-google-charts';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Moment from 'react-moment';

import { userActions } from '../_actions';
import { userService } from '../_services';
import { debug } from 'util';
import Typography from '@material-ui/core/Typography';

class DashboardPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projectReport: [],
      developerReport: [],
      developers: [],
      projects: [],
      todoStatusCount: []
    };
  }

  componentDidMount() {
    // this.props.dispatch(userActions.getAll());

    userService.getReport().then(report => {
        this.setState({
          projectReport: report.project_report,
          developerReport: report.developer_report,
          developers: report.developers,
          todoStatusCount: report.status_count_report
        })
    });
    userService.getProjects().then(projects => {
      this.setState({
        projects: projects
      })
    });
  }

  statusCount = () => {
    const format = s => s.split('_').map(([c, ...s]) => [c.toUpperCase(), ...s].join('')).join(' ');
    var prev = this.state.todoStatusCount,
        result = [
            ['Status', 'Count'],
            ...Object.entries(prev).map(([k, v]) => [format(k), v])
        ];
    return result
  }

  render() {
    if(this.props && this.props.user && !(this.props.user.role === 'admin')){
      return(
        <div className='project-main-div'>
          <h1>You are not authorized</h1>
        </div>
      )
    }
    return (
      <div className='project-main-div'>
        <h1 className='heading-dashboard'>Developer Wise Status</h1>
        <Paper className='report-table-main'>
          <Table className='report-table'>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                {this.state.developers && this.state.developers.map(row => (
                  <TableCell align="left">{row.email}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Todo</TableCell>
                  {this.state.developerReport.todo && this.state.developerReport.todo.map(row => (
                    <TableCell>
                      <Table>
                        {row.todo.map(m_row => (
                          <TableRow>{m_row}</TableRow>
                        ))}
                      </Table>
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
                <TableCell>In Progress</TableCell>
                  {this.state.developerReport.in_progress && this.state.developerReport.in_progress.map(row => (
                    <TableCell>
                      <Table>
                        {row.in_progress.map(m_row => (
                          <TableRow>{m_row}</TableRow>
                        ))}
                      </Table>
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
                <TableCell>Done</TableCell>
                  {this.state.developerReport.done && this.state.developerReport.done.map(row => (
                    <TableCell>
                      <Table>
                        {row.done.map(m_row => (
                          <TableRow>{m_row}</TableRow>
                        ))}
                      </Table>
                    </TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

        <h1 className='heading-dashboard'>Project Wise Todo Status</h1>
        <Paper className='report-table-main'>
          <Table className='report-table'>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                {this.state.projects && this.state.projects.map(row => (
                  <TableCell align="left">{row.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Todo</TableCell>
                  {this.state.projectReport.todo && this.state.projectReport.todo.map(row => (
                    <TableCell>
                      <Table>
                        {row.todo.map(m_row => (
                          <TableRow>{m_row}</TableRow>
                        ))}
                      </Table>
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
                <TableCell>In Progress</TableCell>
                  {this.state.projectReport.in_progress && this.state.projectReport.in_progress.map(row => (
                    <TableCell>
                      <Table>
                        {row.in_progress.map(m_row => (
                          <TableRow>{m_row}</TableRow>
                        ))}
                      </Table>
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
                <TableCell>Done</TableCell>
                  {this.state.projectReport.done && this.state.projectReport.done.map(row => (
                    <TableCell>
                      <Table>
                        {row.done.map(m_row => (
                          <TableRow>{m_row}</TableRow>
                        ))}
                      </Table>
                    </TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        
        <h1 className='heading-dashboard'>Project Wise Report</h1>
        <Paper className='report-table-main'>
          <div className='pie-chart'>
            <Chart
              width={'900px'}
              height={'500px'}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={this.statusCount()}
              options={{
                title: 'Project Wise Report',
                is3D: true,
              }}
              rootProps={{ 'data-testid': '2' }}
            />
          </div>
        </Paper>
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

const connectedDashboardPage = connect(mapStateToProps)(DashboardPage);
export { connectedDashboardPage as DashboardPage };