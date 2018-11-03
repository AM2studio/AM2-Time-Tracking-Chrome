import React, { Component } from 'react';
import './styles/css/content.css';
import LoginContainer from './components/Login/LoginContainer';
import TimeTracking from './components/Timetracking/TimeTracking';
import WP_AUTH from './data/Auth';

const auth = new WP_AUTH();

class App extends Component {
    constructor() {
        super();
        this.state = {
            login: false
        };
    }

    handleLogin = () => {
        this.setState({ login: true });
    };
    render() {
        const { login } = this.state;
        return (
            <div className="am2-chrome-timetracking-app">
                {auth.isAuthenticated() || login === true ? (
                    <TimeTracking />
                ) : (
                    <LoginContainer handleLogin={this.handleLogin} />
                )}
            </div>
        );
    }
}

export default App;
