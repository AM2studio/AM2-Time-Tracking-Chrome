import React, { Component } from 'react';
import './styles/css/content.css';
import LoginContainer from './components/Login/LoginContainer';
import TimeTracking from './components/Timetracking/TimeTracking';
import Loader from './components/General/Loader';
import WP_AUTH from './data/Auth';

class App extends Component {
    constructor() {
        super();
        this.state = {
            login: false,
            loader: true
        };
    }

    componentWillMount() {
        const auth = new WP_AUTH();
        auth.isAuthenticated().then(response => {
            if (response === true) {
                this.setState({ login: true });
            }
            this.setState({ loader: false });
        });
    }

    handleLogin = () => {
        this.setState({ login: true, loader: false });
    };
    render() {
        const { login, loader } = this.state;
        if (loader) {
            return <Loader />;
        }
        return login === true ? (
            <TimeTracking />
        ) : (
            <LoginContainer handleLogin={this.handleLogin} />
        );
    }
}

export default App;
