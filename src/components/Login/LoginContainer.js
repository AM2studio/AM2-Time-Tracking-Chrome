import React, { Component } from 'react';
import WP_AUTH from '../../data/Auth';
import Login from './Login';

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            loader: false,
            error: false
        };

        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    login() {
        this.setState(() => ({ loader: true }));
        const auth = new WP_AUTH();
        const { email, password } = this.state;
        const { handleLogin } = this.props;
        auth.authenticate(email, password).then(result => {
            if (result === 200) {
                handleLogin();
            } else {
                this.setState({ loader: false, error: true });
            }
        });
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({
            [id]: value,
            error: false
        });
    }

    render() {
        const { loader, error } = this.state;
        return (
            <Login
                login={this.login}
                handleChange={this.handleChange}
                loader={loader}
                error={error}
            />
        );
    }
}

export default LoginForm;
