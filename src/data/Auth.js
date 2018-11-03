/* global chrome */
import axios from 'axios';

class WP_AUTH {
    constructor() {
        this.url = 'http://oldcrm.am2studio.com/wp-json/jwt-auth/v1/token';
        this.validateUrl = 'http://oldcrm.am2studio.com/wp-json/jwt-auth/v1/token/validate';
        this.tokenKey = 'crmTokenKey';
        this.userName = 'crmUserName';
    }

    getSessionToken() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(this.tokenKey, items => {
                if (items.crmTokenKey) {
                    resolve(items.crmTokenKey);
                } else {
                    reject(new Error('Session token is not set!'));
                }
            });
        });
    }

    isAuthenticated = () =>
        this.getSessionToken()
            .then(token =>
                axios({
                    method: 'post',
                    url: this.validateUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(() => true)
                    .catch(error => {
                        console.log(error);
                        return false;
                    })
            )
            .catch(rej => {
                // here when you reject the promise
                console.log(rej);
                return false;
            });

    /* Login */
    authenticate(username, password) {
        return axios
            .post(this.url, {
                username,
                password
            })
            .then(response => {
                chrome.storage.local.set({ [this.tokenKey]: response.data.token });
                chrome.storage.local.set({ [this.userName]: response.data.user_display_name });
                return response.status;
                // Set projects maybe
            })
            .catch(error => {
                // handle error
                console.log(error);
                return error;
            });
    }
}

export default WP_AUTH;
