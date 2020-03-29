/* global chrome */
import axios from 'axios';
import WP_AUTH from './Auth';

class WP_API {
    constructor() {
        this.url = 'https://dev-api-myzone-erp.myzone.tech/api/';
        this.auth = new WP_AUTH();
        this.data = false;

        this.tokenKey =
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODUzMjI1MDcsImV4cCI6MTU4NTkyNzMwNywicm9sZXMiOlt7ImlkIjoxLCJuYW1lIjoiU3VwZXIgYWRtaW4ifV0sImVtYWlsIjoiam9obi5kb2VAbXl6b25lLmNvbSIsInJvbGVzX2hhc2giOiJjOTA0ZWZkOTZhYTQ5MzNlNzI1MjMwMDhlZDQ5Y2JjZTIwNzQ1OTFjNzczMGY5NTJiMmZhNTg5YzhlZTIyOGNmIiwib3JnYW5pemF0aW9uX2lkIjoxfQ.FHAui-LEPOJwpwQm3GqADiN6NyBB5QZy2cIusoT_t0_PEPZDneBN0CZ14JLFIE_79tlpSQDD8IFBXTjz4C4rUnwOU9AatjRaib7qNRXFJ1CWxoQQrXe9RtQIOXVosaIoSsIPruOHoIuEO9MGOPyTByK284t87K3eDcw7yHQnV-iqsujVQbg1d71hARiQWQaeyeQk2zyoHootiSh93qcuSZS0cXRRuEmpPBHD1kzJTx4k26tG7bjsizrf2jZ8y71i03rSmRehdGvjCCScJFdmwKKdWZxx8SLCj3K9CXs8W3SBj9cYlxRAXuQwieqo2E-_bJj5WVAgNBA7OxFtvkosEnpTgC6ap0XigfpX9v21Qmtdc-eHuIn1otCChVCDiJCq29kuODbF_JOpnjLyM6agHHHT2SOM9ez1Yzvjf_g32LvltRTTOsjrNGnBSP3rfj3j02vheTfbYVW1FzX2s9azMY3Xh59QAEjnlmhO6hWLih5nLl-idTWJ51QG0TRY9VQ5k_1UcEiPHdxaKPVFErWGJvXO18ripJ5dXKslHTS5iMvplMSxIqunRdW5B9FSV0hFf6cexg7u6xOKsBU0ZcFqOuiJVGm8Cn1ZcQ52LI2G1Pfbm-KdIx0n709Czq_ZKh2pudOIxYVg8VieLQySXmF9kb8Urk7tlTbjwki5fKc0veo';
    }

    getUserData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'get',
                    url: `${this.url}me`,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}`
                    }
                })
                    .then(response => {
                        resolve(response.data.data.id);
                    })
                    .catch(error => {
                        reject(error);
                    })
            );
        });
    }

    getWorkTypes() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'get',
                    url: `${this.url}work-types?pagination=false`,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}`
                    }
                })
                    .then(response => {
                        const formattedResponse = response.data.data.map(wtype => ({
                            id: wtype.id,
                            title: wtype.attributes.name
                        }));
                        resolve(formattedResponse);
                    })
                    .catch(error => {
                        reject(error);
                    })
            );
        });
    }

    getProjects(type, data = undefined) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'get',
                    url: `${this.url}${type}`,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}`
                    },
                    params: data
                })
                    .then(response => {
                        const formattedResponse = response.data.data.map(post => ({
                            id: post.id,
                            title: post.attributes.name,
                            company:
                                post.relationships && post.relationships.company
                                    ? post.relationships.company.data.id
                                    : null
                        }));
                        resolve(formattedResponse);
                    })
                    .catch(error => {
                        reject(error);
                    })
            );
        });
    }

    getMilestones(id) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'get',
                    url: `${this.url}project/milestones?filters[project][equals]=${id}`,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}`
                    }
                })
                    .then(response => {
                        const formattedResponse = response.data.data.map(milestone => ({
                            id: milestone.id,
                            title: milestone.attributes.name
                        }));
                        resolve(formattedResponse);
                    })
                    .catch(error => {
                        reject(error);
                    })
            );
        });
    }

    getContracts(id) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'get',
                    url: `${this.url}contracts?filters[status][in][]=in_progress&filters[project][equals]=${id}`,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}`
                    }
                })
                    .then(response => {
                        const formattedResponse = response.data.data.map(contract => ({
                            id: contract.id,
                            title: contract.attributes.name
                        }));
                        resolve(formattedResponse);
                    })
                    .catch(error => {
                        reject(error);
                    })
            );
        });
    }

    getFeatures(id) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'get',
                    url: `${this.url}project/features?filters[project][equals]=${id}`,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}`
                    }
                })
                    .then(response => {
                        const formattedResponse = response.data.data.map(feature => ({
                            id: feature.id,
                            title: feature.attributes.name
                        }));
                        resolve(formattedResponse);
                    })
                    .catch(error => {
                        reject(error);
                    })
            );
        });
    }

    // getTime() {
    //     return new Promise((resolve, reject) => {
    //         chrome.storage.local.get('crmTokenKey', items =>
    //             axios({
    //                 method: 'get',
    //                 url: `${this.url}daily_time/`,
    //                 headers: {
    //                     Authorization: `Bearer ${items.crmTokenKey}`
    //                 }
    //             })
    //                 .then(response => {
    //                     resolve(response.data);
    //                 })
    //                 .catch(error => {
    //                     reject(error);
    //                 })
    //         );
    //     });
    // }

    static getSavedState(key) {
        return new Promise(resolve => {
            chrome.storage.local.get(key, items => {
                if (items[key] && key !== 'projects') {
                    // Bug: its always saving projects as well! line 94 Timetracking.js
                    resolve({ [key]: items[key] });
                } else {
                    resolve(false);
                }
            });
        });
    }

    set(data) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('crmTokenKey', items =>
                axios({
                    method: 'post',
                    url: `${this.url}time-logs`,
                    headers: {
                        Authorization: `Bearer ${items.crmTokenKey}` // ${items.crmTokenKey}`
                    },
                    data: data
                })
                    .then(response => {
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
