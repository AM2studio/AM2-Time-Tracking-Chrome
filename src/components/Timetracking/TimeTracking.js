/* global chrome */
import React, { Component } from 'react';
import moment from 'moment';
import WP_API from './../../data/Api';
import Time from './../Form/TimePicker';
import Text from './../Form/Text';
import Select from './../Form/Select';
import Textarea from './../Form/Textarea';
import DatePicker from './../Form/DatePicker';
import Notification from './../Form/Notification';

class AddTime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: moment().format('DD/MM/YYYY'),
            hours: '01:00',
            billable_hours: '01:00',
            project: '',
            projects: [],
            job_type: '2',
            asana_url: '',
            comment: '',
            msgText: '',
            status: false,
            loader: false
        };
    }

    componentWillMount() {
        this.initialState = this.state;
        // Projects
        chrome.storage.local.get('projects', storage => {
            if (storage.projects) {
                this.setState({ projects: JSON.parse(storage.projects) });
            } else {
                const api = new WP_API();
                api.getPosts('projects')
                    .then(result => {
                        const posts = result.map(post => ({
                            id: post.id,
                            title: post.title,
                            company: post.company_name
                        }));
                        chrome.storage.local.set({ projects: JSON.stringify(posts) });
                        this.setState({ projects: posts });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    }

    inputChangeEvent = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value, status: false });
        if (name === 'hours') {
            this.setState({ billable_hours: value });
        }
    };

    closeNotification = () => {
        this.setState(() => ({ status: false }));
    };

    addUserEntry = () => {
        const { project: projectId, comment } = this.state;
        // Validation
        if (projectId === '' || comment === '') {
            this.setState(() => ({
                status: 'error',
                msgText: 'Required fields are missing.'
            }));
            return;
        }
        // Proceed
        this.setState(() => ({ loader: true }));
        const api = new WP_API();
        api.setPost('time-entry', '', this.state);
        api.set().then(result => {
            if (result.success === true) {
                const { projects, ...rest } = this.initialState;
                this.setState(rest);
                this.setState(() => ({
                    status: 'success',
                    msgText: 'Entry Added!'
                }));
            } else {
                this.setState(() => ({
                    status: 'error',
                    msgText: 'Upss.. something went wrong! Check with Goran.',
                    loader: false
                }));
                console.log('Something went wrong!');
            }
        });
    };

    render() {
        const {
            date,
            hours,
            project,
            billable_hours, // eslint-disable-line camelcase
            job_type, // eslint-disable-line camelcase
            asana_url, // eslint-disable-line camelcase
            comment,
            status,
            msgText,
            projects
        } = this.state;

        const jobType = [
            { id: '2', title: 'Dev' },
            { id: '0', title: 'PM' },
            { id: '1', title: 'Web Design' },
            { id: '13', title: 'Graphic Design' },
            { id: '3', title: 'Personal development' },
            { id: '4', title: 'Administration' },
            { id: '5', title: 'Meeting (client)' },
            { id: '6', title: 'Meeting (internal)' },
            { id: '7', title: 'Team Management' },
            { id: '8', title: 'QA' },
            { id: '9', title: 'Support' },
            { id: '10', title: 'Preparing quote' },
            { id: '11', title: 'Content Transfer' },
            { id: '12', title: 'Junior Training' }
        ];

        const inputs = [
            {
                type: Select,
                name: 'project',
                label: 'Project',
                placeholder: 'Select Project',
                list: projects,
                required: true,
                value: project,
                parentClass: 'column twelve'
            },
            {
                type: DatePicker,
                name: 'date',
                label: 'Date',
                value: date,
                required: true,
                parentClass: 'column twelve'
            },
            {
                type: Time,
                name: 'hours',
                label: 'Hours of Work',
                required: true,
                value: hours,
                parentClass: 'column twelve'
            },
            {
                type: Time,
                name: 'billable_hours',
                label: 'Billable Hours',
                required: true,
                value: billable_hours,
                parentClass: 'column twelve'
            },
            {
                type: Select,
                name: 'job_type',
                label: 'Job Type',
                placeholder: 'Select Work Type',
                required: true,
                value: job_type,
                list: jobType,
                parentClass: 'column twelve'
            },
            {
                type: Text,
                name: 'asana_url',
                label: 'Asana URL',
                value: asana_url,
                parentClass: 'column twelve'
            },
            {
                type: Textarea,
                name: 'comment',
                label: 'Comment',
                rows: '4',
                required: true,
                value: comment,
                parentClass: 'column twelve'
            }
        ];

        return (
            <div className="widget">
                <header className="section__header">
                    <h4 className="section__title">AM2 Time Tracking</h4>
                </header>
                <div className="section__content">
                    <div className="widget">
                        <form className="form">
                            {status ? (
                                <Notification
                                    text={msgText}
                                    type={status}
                                    close={this.closeNotification}
                                />
                            ) : (
                                ''
                            )}
                            <div className="form__row">
                                {inputs.map(field => (
                                    <field.type
                                        key={field.name}
                                        label={field.label}
                                        name={field.name}
                                        parentClass={field.parentClass}
                                        required={field.required}
                                        value={field.value}
                                        list={field.list}
                                        rows={field.rows}
                                        className="form__input"
                                        placeholder={field.placeholder}
                                        inputChangeEvent={this.inputChangeEvent}
                                    />
                                ))}
                                <div className="column twelve">
                                    <button
                                        type="button"
                                        className="button"
                                        onClick={this.addUserEntry}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddTime;
