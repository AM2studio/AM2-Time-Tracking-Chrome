/* global chrome */
import axios from 'axios';

class WP_AUTH {
    constructor() {
        this.url = 'https://erp2-api.myzone.com/login';
        this.validateUrl = 'https://erp2-api.myzone.com/api/me';
        this.tokenKey = 'crmTokenKey';
        this.Email = 'crmEmail';
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
                    method: 'get',
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
                console.log(rej);
                return false;
            });

    /* Login */
    authenticate(email, password) {
        return axios
            .post(this.url, {
                email,
                password
            })
            .then(response => {
                chrome.storage.local.set({ [this.tokenKey]: response.data.token });
                chrome.storage.local.set({ [this.Email]: response.data.user_display_name });
                return response.status;
            })
            .catch(error => {
                console.log(error);
                return error;
            });
    }
}

export default WP_AUTH;
