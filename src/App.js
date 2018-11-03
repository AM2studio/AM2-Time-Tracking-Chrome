import React, { Component } from 'react';
import './styles/css/content.css';
import LoginContainer from './components/Login/LoginContainer';
import TimeTracking from './components/Timetracking/TimeTracking';
import WP_AUTH from './data/Auth';

class App extends Component {
    constructor() {
        super();
        this.state = {
            login: false
        };
    }

    componentWillMount() {
        const auth = new WP_AUTH();
        auth.isAuthenticated().then(response => {
            if (response === true) {
                this.setState({ login: true });
            }
        });
    }

    handleLogin = () => {
        this.setState({ login: true });
    };
    render() {
        const { login } = this.state;
        return login === true ? (
            <TimeTracking />
        ) : (
            <LoginContainer handleLogin={this.handleLogin} />
        );
    }
}

export default App;
