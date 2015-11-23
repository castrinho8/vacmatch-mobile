import React from 'react'
import mui from 'material-ui'

import style from './report-style'
import ReportProperty from './ReportProperty'
import Crono from './Crono'

let FlatButton = mui.FlatButton
let RaisedButton = mui.RaisedButton

let Report = React.createClass({

  getInitialState: function () {
    return {
      term: 1
    }
  },

  _modifyTerm: function (newTerm) {
    this.setState({
      term: newTerm
    })
  },

  render: function () {
    return <div>
      <div style={style.center}>
        <FlatButton label='Local' secondary={true} />
        <FlatButton label='Visitor' secondary=	{true} />
        <ReportProperty value={'0 - 2'} isTitle={true} />
      </div>
      <div style={style.container}>
        <ReportProperty name={'Term'} value={this.state.term} isPrimary={false} />
        <ReportProperty name={'Fouls'} value={'3 - 3'} isPrimary={false} />
      </div>
      <div style={style.center}>
        <Crono initTime={1200000} term={this.state.term} termUpdate={this._modifyTerm}/>
      </div>
      <hr/>
      <div style={style.center}>
        <div style={style.buttonRow}>
          <RaisedButton label='Goal' primary={true} style={style.button} />
          <RaisedButton label='Foul' primary={true} style={style.button} />
        </div>
        <div style={style.buttonRow}>
          <RaisedButton label='Yellow card' primary={true} style={style.button} />
          <RaisedButton label='Red card' primary={true} style={style.button} />
        </div>
      </div>
    </div>
  }

})

module.exports = Report
