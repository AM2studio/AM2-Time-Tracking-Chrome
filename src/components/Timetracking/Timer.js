import React from 'react';

export default props => {
    const { startTimer, stopTimer, timerIsRunning } = props;
    return (
        <div className="timer">
            {timerIsRunning ? (
                <React.Fragment>
                    <button type="button" className="button" onClick={stopTimer}>
                        <span className="timer__time">{timerIsRunning}</span>
                        Stop Timer
                    </button>
                </React.Fragment>
            ) : (
                <button type="button" className="button" onClick={startTimer}>
                    Start Timer
                </button>
            )}
        </div>
    );
};
