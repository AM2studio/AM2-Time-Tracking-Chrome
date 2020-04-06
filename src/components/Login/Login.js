import React from 'react';

import Loader from '../General/Loader';
import logo from '../../styles/images/logo.png';
import '../../styles/css/login.css';

const Login = props => {
    const { handleChange, login, loader, error } = props;
    if (loader) {
        return <Loader />;
    }
    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">
                    <form className="validate-form">
                        <div className="w-full text-center logo">
                            <img
                                className="logo"
                                alt="Logo"
                                src={logo}
                                style={{ width: '100px' }}
                            />
                        </div>
                        <span className="login100-form-title p-b-239">Account Login</span>
                        {error ? (
                            <div className="notification notification--error" role="alert">
                                <button
                                    type="button"
                                    className="notification__close"
                                    data-dismiss="alert"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                                <p>
                                    <strong>Error:</strong> Wrong email or password.
                                </p>
                            </div>
                        ) : (
                            ''
                        )}
                        <div
                            className="wrap-input100 validate-input m-b-20"
                            data-validate="Type user name"
                        >
                            <input
                                className="input100"
                                type="text"
                                name="email"
                                id="email"
                                onChange={handleChange}
                                placeholder="Email"
                            />
                            <span className="focus-input100" />
                        </div>
                        <div
                            className="wrap-input100 validate-input m-b-20"
                            data-validate="Type password"
                        >
                            <input
                                type="password"
                                className="input100"
                                placeholder="Password"
                                id="password"
                                onChange={handleChange}
                            />
                            <span className="focus-input100" />
                        </div>

                        <div className="container-login100-form-btn">
                            <button type="submit" onClick={login} className="login100-form-btn">
                                Sign in
                            </button>
                        </div>
                        <div className="w-full text-center p-t-27 p-b-239" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
