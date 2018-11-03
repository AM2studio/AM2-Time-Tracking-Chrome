/* global chrome */
import axios from 'axios';
import WP_AUTH from './Auth';

class WP_API {
    constructor() {
        this.url = 'http://oldcrm.am2studio.com/wp-json/crm/v2/';
        this.auth = new WP_AUTH();
        this.data = false;
    }

    getPosts(type, data = undefined) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'get',
                    url: `${this.url}${type}/`,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}`
                    },
                    params: data
                })
                    .then(response => {
                        resolve(response.data.data);
                    })
                    .catch(error => {
                        reject(error);
                    })
            );
        });
    }

    getTime() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'get',
                    url: `${this.url}daily_time/`,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}`
                    }
                })
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(error => {
                        reject(error);
                    })
            );
        });
    }

    setPost(type, id = undefined, dataToUpdate = undefined) {
        this.url = `${this.url}${type}/`;
        if (id) {
            this.url = `${this.url}${id}/`;
        }
        this.dataToUpdate = dataToUpdate;
    }

    set() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'post',
                    url: this.url,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}`
                    },
                    data: this.dataToUpdate
                })
                    .then(response => {
                        console.log(response.data);
                        resolve(response.data);
                    })
                    .catch(error => {
                        // handle error
                        reject(error);
                    })
            );
        });
    }
}

export default WP_API;
