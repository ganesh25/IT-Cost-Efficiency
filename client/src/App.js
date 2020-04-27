import React from 'react';
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { AddBox, ArrowDownward } from "@material-ui/icons";
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const [columns, setColumns] = React.useState(
    [
      { title: 'Measure ID', field: 'measureId', sorting: true },
      { title: 'Customer', field: 'customerId.customer' },
      { title: 'External Measure ID', field: 'externalMeasureId' },
      { title: 'Measure', field: 'measure' },
      { title: 'Description', field: 'description' },
      { title: 'Saving Potential (€)', field: 'potential', type: 'numeric' },
      { title: 'Duration in Months', field: 'durationInMonth', type: 'numeric' },
      { title: 'Status', field: 'status' },
      { title: 'Status Lang', field: 'statusLang' },
    ]);
  const [rows, setRows] = React.useState({
    rows: []
  });
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const logOut = (event, reason) => {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    localStorage.removeItem('customerId')
    window.location.href = '/signin'
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  useEffect(() => {
    // const result = await axios.get(
    //   'http://localhost:4000/measures',
    // );
    if (!localStorage.getItem('id')) {
      window.location.href = "/signin"
      return
    }
    fetch('http://localhost:4000/measures?id=' + localStorage.getItem('id'), {
      method: 'GET',
      headers: { 'x-access-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setRows(data);
      })
      .catch(error => console.log(error));
  }, []); const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            IT Cost Efficiency
        </Typography>
          {/* <Button color="inherit" onClick={() => { window.location.href = '/signup'; }}>Login</Button> */}
          <Button color="inherit" onClick={logOut}>Logout</Button>
        </Toolbar>

      </AppBar>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Please enter values for all the fields listed
        </Alert>
      </Snackbar>
      {rows.length > 0 ?
        <MaterialTable
          icons={tableIcons}
          title="Customer Measures"
          columns={columns}
          data={rows}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                if (Object.keys(newData).length < 8) {
                  setOpen(true);
                  reject()
                }
                else {
                  setTimeout(() => {
                    newData.customerId = localStorage.getItem('customerId') + ''
                    resolve();
                    axios
                      .post("http://localhost:4000/measures", newData, {
                        headers: { 'x-access-token': localStorage.getItem('token') }
                      })
                      .then((response) => {
                        setRows(prevState => {
                          const data = [...prevState];
                          data.push(response.data);
                          return data;
                        })
                      })
                      .catch(function (e) {
                        console.log(e);
                      }, 600);
                  })
                }
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                setTimeout(() => {
                  newData.customerId = localStorage.getItem('customerId') + ''
                  resolve();
                  axios
                    .put("http://localhost:4000/measures/" + oldData.measureId, newData, {
                      headers: { 'x-access-token': localStorage.getItem('token') }
                    })
                    .then((response) => {
                      setRows(prevState => {
                        const data = [...prevState];
                        data[data.indexOf(oldData)] = newData;
                        return data;
                      })
                    })
                    .catch(function (e) {
                      console.log(e);
                    }, 600);
                })

              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  axios
                    .delete("http://localhost:4000/measures/" + oldData.measureId, {
                    })
                    .then((response) => {
                      setRows(prevState => {
                        const data = [...prevState];
                        data.splice(data.indexOf(oldData), 1);
                        return data;
                      })
                    })
                    .catch(function (e) {
                      console.log(e);
                    }, 600);
                })
              }),
          }}
        />
        : <Typography variant="h6" className={classes.title}>
          You have not been assigned customers at the moment, please contact your administrator.
    </Typography>}
    </div>
  );
}

export default App;
