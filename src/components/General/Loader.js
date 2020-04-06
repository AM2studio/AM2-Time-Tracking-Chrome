import React from 'react';
import logo from '../../styles/images/logo.png';
import animation from '../../styles/images/loading.gif';

export default () => (
    <div className="limiter">
        <div className="container-login100">
            <div className="wrap-login100">
                <div className="w-full text-center logo">
                    <img className="logo" alt="Logo" src={logo} style={{ width: '100px' }} />
                </div>
                <div className="loaderWidget login-animation">
                    <img alt="loader" src={animation} width="290" height="220" />
                </div>
            </div>
        </div>
    </div>
);
