import {Switch, Redirect, Route} from 'react-router-dom'
import Home from './Components/Home'
import JobItemDetails from './Components/JobItemDetails'
import Jobs from './Components/Jobs'
import Login from './Components/Login'
// import Home from './Components/Home/'
import NotFound from './Components/NotFound'
import ProtectedRoute from './Components/ProtectedRoute'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
