class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerType: "session",
      timer: 1500,
      active: false,
      intervalID: ""
    };

    this.editLength = this.editLength.bind(this);
    this.timemmss = this.timemmss.bind(this);
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.countdown = this.countdown.bind(this);
  }

  editLength(setting, value) {
    let timeState = setting + "Length";
    let time = this.state[timeState] + value;

    if (time > 60) {
      time = 60;
    } else if (time <= 0) {
      time = 1;
    }

    this.setState({
      [timeState]: time
    });
    
    if (setting == "session") {
      this.setState({
        timer: time * 60
      })
    }
  }

  timemmss() {
    let time = this.state.timer;
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  }

  countdown() {
    let timer = this.state.timer;
    let timerType = this.state.timerType;

    if (timer > 0) {
      this.setState({
        timer: timer - 1
      });
    } else {
      timerType = timerType == "session" ? "break" : "session";
      timer = this.state[timerType + "Length"] * 60;
      const audio = document.getElementById("beep");
      audio.currentTime = 0;
      audio.play();
      this.setState({
        timer: timer,
        timerType: timerType
      });
    }
  }

  startStopTimer() {
    let intervalID = this.state.intervalID;
    let active = this.state.active;

    if (active) {
      clearInterval(intervalID);
      intervalID = "";
      active = false;
    } else {
      intervalID = setInterval(this.countdown, 1000);
      active = true;
    }

    this.setState({
      intervalID: intervalID,
      active: active
    });
  }

  resetTimer() {
    clearInterval(this.state.intervalID);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerType: "session",
      timer: 1500,
      active: false,
      intervalID: ""
    });
  }

  render() {
    return (
      <div className="clock">
        <h1 className="text-center mt-5">25 + 5 Clock</h1>
        <div className="row text-center mt-5" id="settings">
          <ClockSettings
            setting="break"
            onClick={this.editLength}
            length={this.state.breakLength}
          />
          <ClockSettings
            setting="session"
            onClick={this.editLength}
            length={this.state.sessionLength}
          />
        </div>
        <div id="timer" className="text-center mt-5">
          <h2 id="timer-label">
            {this.state.timerType.charAt(0).toUpperCase() +
              this.state.timerType.slice(1)}
          </h2>
          <h1 id="time-left">{this.timemmss()}</h1>
        </div>
        <TimerButtons
          active={this.state.active}
          onClickStart={this.startStopTimer}
          onClickReset={this.resetTimer}
        />
      </div>
    );
  }
}

class ClockSettings extends React.Component {
  render() {
    return (
      <div className="col col-xs-6" id={this.props.setting + "-label"}>
        {this.props.setting.charAt(0).toUpperCase() +
          this.props.setting.slice(1)}{" "}
        Length
        <div id={this.props.setting + "-setting"}>
          <button
            className="btn"
            onClick={() => this.props.onClick(this.props.setting, -1)}
            id={this.props.setting + "-decrement"}
          >
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <p class="d-inline" id={this.props.setting + "-length"}>
            {this.props.length}
          </p>
          <button
            className="btn"
            onClick={() => this.props.onClick(this.props.setting, 1)}
            id={this.props.setting + "-increment"}
          >
            <i class="fa-solid fa-arrow-up"></i>
          </button>
        </div>
        <audio
          id="beep"
          src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        />
      </div>
    );
  }
}

class TimerButtons extends React.Component {
  render() {
    return (
      <div className="text-center" id="timerButtons">
        <button
          className="btn"
          id="start_stop"
          onClick={this.props.onClickStart}
        >
          <i
            class={this.props.active ? "fa-solid fa-pause" : "fa-solid fa-play"}
          ></i>
        </button>

        <button className="btn" id="reset" onClick={this.props.onClickReset}>
          <i class="fa-solid fa-rotate"></i>
        </button>
      </div>
    );
  }
}
ReactDOM.render(<Clock />, document.getElementById("app"));
