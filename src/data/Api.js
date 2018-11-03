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
                    console.log(response);
                    return response.data;
                })
                .catch(error => {
                    // handle error
                    console.log(error);
                })
        );
    }

    setPost(type, id = undefined, dataToUpdate = undefined) {
        this.url = `${this.url}${type}/`;
        if (id) {
            this.url = `${this.url}${id}/`;
        }
        this.dataToUpdate = dataToUpdate;
    }

    set() {
        return axios({
            method: 'post',
            url: this.url,
            headers: {
                Authorization: `Bearer ${this.auth.getSessionToken()}`
            },
            data: this.dataToUpdate
        })
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .catch(error => {
                // handle error
                console.log(error);
            });
    }
}

export default WP_API;
