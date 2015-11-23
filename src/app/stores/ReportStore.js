import Reflux from 'reflux'
import Stopwatch from 'timer-stopwatch'

import ReportActions from '../actions/ReportActions'

let ReportStore = Reflux.createStore({
  listenables: ReportActions,

  init: function () {
    this.state = {
      isPlaying: false,
      timer: new Stopwatch(1200000),
      time: this.milisecondsToString(1200000),
      term: '1'
    }
  },

  getInitialState: function () {
    return this.state
  },

  // Parse crono string and convert it to milisecond
  stringToMiliseconds: function (time) {
    let elements = time.split(':')
    return (parseInt(elements[0], 10) * 60000) + (parseInt(elements[1], 10) * 1000)
  },

  // Create crono string from milisecond
  milisecondsToString: function (miliseconds) {
    let date = new Date(miliseconds)
    return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
      ' : ' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
  },

  onUpdateTime: function () {
    this.state.timer.on('time', (time) => {
      this.state.time = this.milisecondsToString(time.ms)
      this.trigger(this.state)
    })
    this.state.timer.startstop()
    this.state.isPlaying = !this.state.isPlaying
    this.trigger(this.state)
  },

  onResetTime: function (string) {
    let miliseconds = this.stringToMiliseconds(string)
    this.state.timer.stop()
    this.state.isPlaying = false
    this.state.timer = new Stopwatch(miliseconds)
    this.state.time = this.milisecondsToString(miliseconds)
    this.trigger(this.state)
  },

  onUpdateTerm: function (newTerm) {
    this.state.term = newTerm
    this.trigger(this.state)
  }

})

module.exports = ReportStore
