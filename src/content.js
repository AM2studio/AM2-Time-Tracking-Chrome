/* global chrome */
/* eslint-disable */
/* src/content.js */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import './styles/css/content.css';
import LoginContainer from './components/Login/LoginContainer';
import TimeTracking from './components/Timetracking/TimeTracking';
import WP_AUTH from './data/Auth';

const auth = new WP_AUTH();

class Main extends Component {
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
            <Frame
                head={[
                    <React.Fragment>
                        <link
                            type="text/css"
                            rel="stylesheet"
                            href={chrome.runtime.getURL('/static/css/0.chunk.css')}
                        />
                        <link
                            type="text/css"
                            rel="stylesheet"
                            href={chrome.runtime.getURL('/static/css/1.chunk.css')}
                        />
                    </React.Fragment>
                ]}
            >
                <FrameContextConsumer>
                    {// Callback is invoked with iframe's window and document instances
                    ({ document, window }) => (
                        // Render Children
                        <div className="am2-chrome-timetracking-app">
                            {auth.isAuthenticated() || login === true ? (
                                <TimeTracking />
                            ) : (
                                <LoginContainer handleLogin={this.handleLogin} />
                            )}
                        </div>
                    )}
                </FrameContextConsumer>
            </Frame>
        );
    }
}

const app = document.createElement('div');
app.id = 'am2-chrome-timetracking-app';

document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = 'none';

function toggle() {
    if (app.style.display === 'none') {
        app.style.display = 'block';
    } else {
        app.style.display = 'none';
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'clicked_browser_action') {
        toggle();
    }
});
