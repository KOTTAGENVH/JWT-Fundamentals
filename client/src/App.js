import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import { deleteUser, login, logOut } from './apiCalls/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

function App() {

  const [user, setUser] = React.useState(null);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  //Handle Function to login
  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(username, password).then((res) => {
      setUser(res);
      console.log("res", res);
    }
    );
  };

  //Handle Function to logout
  const handleLogOut = async (event) => {
    event.preventDefault();
    console.log("?.accessToken", user?.accessToken)
    await logOut(user?.accessToken).then((res) => {
      toast.success(res);
      setUser(null);
      setPassword("");
      setUsername("");
      console.log("res", res);
    },
      (err) => {
        console.log("?.accessToken", user?.accessToken)

        toast.error(err);
        console.log("err", err);
      }
    );
  };

  //Handle Function to delete user
  const handleDelete = async (id, event) => {
    event.preventDefault();
    console.log("?.accessToken", user?.accessToken);
    console.log("?.accessToken", user);
  
    try {
      const res = await deleteUser(id, user?.accessToken);
      // Handle success case
      toast.success(res);
      setUser(null);
      setPassword("");
      setUsername("");
      console.log("res", res);
    } catch (err) {
      // Handle error case
      console.log("?.accessToken", user?.accessToken);
      toast.error(err.message || "An error occurred");
      console.log("Sry, an error occurred", err);
    }
  };


  return (
    <div className='App' >
      <ToastContainer />
      {!user ? (
        <ThemeProvider theme={defaultTheme}>
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                  t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="User Name"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => setUsername(e.target.value)}

                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}

                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}

                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      ) : (
        <div
          style={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}
        >
          <Typography component="h1" variant="h5" style={{ marginTop: "20%" }}> Welcome {user.username} </Typography>
          <Typography component="h1" variant="h5"> You are {user.isAdmin ? "Admin" : "User"} </Typography>
          <Button
            onClick={handleLogOut}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}

          >
            Log Out
          </Button>
          <Button
            onClick={(event) => handleDelete(1, event)}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}

          >
            Delete User Sagala (Userid 1)
          </Button>
          <Button
            onClick={(event) => handleDelete(2, event)}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}

          >
            Delete User Rapla (Userid 2)
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
