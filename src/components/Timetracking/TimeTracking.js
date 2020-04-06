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
import Timer from './Timer';

class AddTime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: moment().format('MM/DD/YYYY'), // Date here needs to be this format, while DatePicker has mooment object state
            hours: '01:00',
            billable_hours: '01:00',
            is_billable: 1,
            project: '',
            projects: [],
            asana_url: '',
            milestone: '',
            milestones: [],
            workType: '',
            workTypes: [],
            feature: '',
            features: [],
            contract: '',
            contracts: [],
            comment: '',
            msgText: '',
            userId: '',
            status: false,
            loader: false,
            timerIsRunning: false,
            totalTime: 0
        };
    }

    componentWillMount() {
        this.initialState = this.state;
        // Populate inputs
        this.getSavedData();
        // Users
        this.getUserData();
        // Projects
        this.getProjects();
        // Timer
        this.getTimer();
        // Wtype
        this.getWorkTypes();
    }

    getUserData = () => {
        const api = new WP_API();
        api.getUserData().then(response => {
            this.setState({
                userId: response
            });
        });
    };

    getWorkTypes = () => {
        const api = new WP_API();
        api.getWorkTypes().then(response => {
            console.log(response);
            this.setState({
                workTypes: response,
                workType: response[0] && response[0].id
            });
        });
    };

    getMilestones = projectId => {
        const api = new WP_API();
        api.getMilestones(projectId).then(response => {
            console.log(response);
            this.setState({
                milestones: response,
                milestone: response[0] && response[0].id
            });
        });
    };

    getFeatures = projectId => {
        const api = new WP_API();
        api.getFeatures(projectId).then(response => {
            this.setState({
                features: response,
                feature: response[0] && response[0].id
            });
        });
    };

    getContracts = projectId => {
        const api = new WP_API();
        api.getContracts(projectId).then(response => {
            console.log(response);
            this.setState({
                contracts: response,
                contract: response[0] && response[0].id
            });
        });
    };

    getSavedData = () => {
        Object.keys(this.state).map(key =>
            WP_API.getSavedState(key).then(value => {
                if (value) {
                    this.setState({ ...value });
                }
                if (key === 'project') {
                    this.getMilestones(value[key]);
                    this.getContracts(value[key]);
                    this.getFeatures(value[key]);
                }
            })
        );
    };

    getProjects = () => {
        const api = new WP_API();
        api.getProjects(
            'projects?pagination=false&filters[contracts.id][exists]=1&filters[contracts.status][in][]=in_progress'
        )
            .then(response => {
                chrome.storage.local.set({ projects: JSON.stringify(response) });
                this.setState({ projects: response });
            })
            .catch(error => {
                console.log(error);
            });
        // api.getTime().then(result => {
        //     this.setState({ totalTime: result });
        // });
    };

    getTimer = () => {
        chrome.runtime.sendMessage({ type: 'getTimer' }, response => {
            if (response) {
                const hours = `0${new Date(response).getHours() - 1}`.slice(-2);
                const minutes = `0${new Date(response).getMinutes()}`.slice(-2);
                this.setState({
                    timerIsRunning: `${hours}:${minutes}`
                });
            }
        });
    };

    inputChangeEvent = e => {
        const { name, value } = e.target;
        this.setState(
            () => ({ [name]: value, status: false }),
            name !== 'projects' ? chrome.storage.local.set({ [name]: value }) : ''
        );
        if (name === 'hours') {
            this.setState({ billable_hours: value });
        }
        if (name === 'project') {
            this.getMilestones(value);
            this.getFeatures(value);
            this.getContracts(value);
        }
    };

    closeNotification = () => {
        this.setState(() => ({ status: false }));
    };

    addUserEntry = () => {
        const {
            project,
            userId,
            contract,
            comment,
            milestone,
            feature,
            workType,
            date,
            asana_url,
            hours
        } = this.state;

        // Validation
        if (project === '' || comment === '' || milestone === '') {
            this.setState(() => ({
                status: 'error',
                msgText: 'Required fields are missing.'
            }));
            return;
        }

        // Proceed
        this.setState(() => ({ loader: true }));
        const api = new WP_API();
        const data = {
            created_by: userId,
            project,
            project_contract: contract,
            milestone,
            feature,
            work_type: workType,
            date: date,
            time_spent: hours.split(':').reduce((acc, time) => 3600 * acc + +time * 60),
            time_spent_billable: hours.split(':').reduce((acc, time) => 3600 * acc + +time * 60),
            comment: comment,
            task_url: asana_url
        };

        api.set(data)
            .then(result => {
                console.log(result);
                if (result.code === 'timelog.itemSuccessfulyCreated') {
                    Object.keys(this.state).map(key => chrome.storage.local.remove(key));
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
                }
            })
            .catch(() => {
                this.setState(() => ({
                    status: 'error',
                    msgText: 'Upss.. something went wrong! Check with Goran.',
                    loader: false
                }));
            });
    };

    startTimer = () => {
        chrome.runtime.sendMessage({ type: 'startTimer' });
        this.setState({ timerIsRunning: '00:00' });
    };

    stopTimer = () => {
        chrome.runtime.sendMessage({ type: 'stopTimer' }, response => {
            const hours = `0${new Date(response).getHours() - 1}`.slice(-2);
            const minutes = `0${new Date(response).getMinutes()}`.slice(-2);
            this.setState({
                hours: `${hours}:${minutes}`,
                billable_hours: `${hours}:${minutes}`,
                timerIsRunning: false
            });
        });
    };

    render() {
        const {
            date,
            hours,
            project,
            projects,
            milestone,
            milestones,
            contracts,
            contract,
            feature,
            features,
            workTypes,
            workType, // eslint-disable-line camelcase
            asana_url, // eslint-disable-line camelcase
            comment,
            status,
            msgText,
            totalTime,
            timerIsRunning
        } = this.state;

        const inputs = [
            {
                type: Time,
                name: 'hours',
                label: 'Time logged',
                required: true,
                value: hours,
                parentClass: 'column twelve'
            },
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
                type: Select,
                name: 'contract',
                label: 'Project Contract',
                placeholder: 'Select contract',
                list: contracts,
                value: contract,
                parentClass: 'column twelve'
            },
            {
                type: Select,
                name: 'milestone',
                label: 'Milestone',
                placeholder: 'Select Milestone',
                list: milestones,
                value: milestone,
                parentClass: 'column twelve'
            },
            {
                type: Select,
                name: 'feature',
                label: 'Feature',
                placeholder: 'Select feature',
                list: features,
                value: feature,
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
            // {
            //     type: Time,
            //     name: 'billable_hours',
            //     label: 'Billable Hours',
            //     required: true,
            //     value: billable_hours,
            //     parentClass: 'column twelve'
            // },
            {
                type: Select,
                name: 'workType',
                label: 'Work Type',
                placeholder: 'Select Work Type',
                required: true,
                value: workType,
                list: workTypes,
                parentClass: 'column twelve'
            },
            {
                type: Text,
                name: 'asana_url',
                label: 'Task URL',
                value: asana_url,
                parentClass: 'column twelve'
            },
            {
                type: Textarea,
                name: 'comment',
                label: 'Work Description',
                rows: '4',
                required: true,
                value: comment,
                parentClass: 'column twelve'
            }
        ];

        return (
            <div className="widget">
                <header className="section__header">
                    <h4 className="section__title">MyZone Time Tracking</h4>
                    <Timer
                        timerIsRunning={timerIsRunning}
                        startTimer={this.startTimer}
                        stopTimer={this.stopTimer}
                    />
                </header>
                <div className="section__content">
                    <div className="widget">
                        <form className="form">
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
                                {status ? (
                                    <Notification
                                        text={msgText}
                                        type={status}
                                        close={this.closeNotification}
                                    />
                                ) : (
                                    ''
                                )}
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
