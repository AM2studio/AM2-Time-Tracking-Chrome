/* global chrome */
import axios from 'axios';

class WP_AUTH {
    constructor() {
        this.url = 'http://oldcrm.am2studio.com/wp-json/jwt-auth/v1/token';
        this.validateUrl = 'http://oldcrm.am2studio.com/wp-json/jwt-auth/v1/token/validate';
        this.permissionsUrl = 'http://oldcrm.am2studio.com/wp-json/crm/v2/permissions';
        this.tokenKey = 'crmTokenKey';
        this.userName = 'crmUserName';
        this.permissions = 'permissions';
    }

    getSessionToken = () =>
        chrome.storage.local.get('crmTokenKey', items => {
            console.log(items);
            if (items) {
                return items;
            }
            return null;
        });

    removeSessionToken = () => {
        localStorage.clear();
        sessionStorage.clear();
    };

    /* Used for private routes */
    async isAuthenticated() {
        await chrome.storage.local.get('crmTokenKey', storageItems => {
            if (storageItems) {
                return axios({
                    method: 'post',
                    url: this.validateUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${storageItems.crmTokenKey}`
                    }
                })
                    .then(() => true)
                    .catch(error => {
                        console.log(error);
                        return false;
                    });
            }
            return false;
        });
    }

    /* Login */
    authenticate(username, password) {
        return axios
            .post(this.url, {
                username,
                password
            })
            .then(response => {
                console.log(response);
                chrome.storage.local.set({ crmTokenKey: response.data.token });
                chrome.storage.local.set({ crmUserName: response.data.user_display_name });
                // Get role
                return axios({
                    method: 'post',
                    url: this.permissionsUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${response.data.token}`
                    }
                });
            })
            .then(response => {
                console.log(response);
                chrome.storage.local.set({ permissions: response.data });
                return response.status;
            })
            .catch(error => {
                // handle error
                console.log(error);
                return error;
            });
    }
}

export default WP_AUTH;
