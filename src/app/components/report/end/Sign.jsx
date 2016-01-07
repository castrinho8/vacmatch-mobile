import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'
import genericStyle from '../../../../assets/style/generic-style'
import SignStore from '../../../stores/SignStore'
import SignActions from '../../../actions/SignActions'
import Card from 'material-ui/lib/card/card'
import CardHeader from 'material-ui/lib/card/card-header'
import CardText from 'material-ui/lib/card/card-text'
import dateFormat from 'dateformat'

let RaisedButton = mui.RaisedButton
let Snackbar = mui.Snackbar
let Dialog = mui.Dialog
let FlatButton = mui.FlatButton
let TextField = mui.TextField
let SelectField = require('material-ui/lib/select-field')
let Avatar = mui.Avatar

let Sign = React.createClass({
  mixins: [
    Reflux.connect(SignStore, 'signatures')
  ],

  propTypes: {
    personList: React.PropTypes.array,
    title: React.PropTypes.string,
    reportId: React.PropTypes.string,
    teamId: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      dialogIsOpen: false,
      snackbarMessage: '',
      index: 0,
      value: {},
      userId: null
    }
  },

  toggleSnackBar: function (newText) {
    this.setState({
      dialogIsOpen: this.state.dialogIsOpen,
      snackbarMessage: newText,
      index: this.state.index,
      value: this.state.value,
      userId: this.state.userId
    })
    this.refs.snack.show()
  },

  toggleDialog: function () {
    this.setState({
      dialogIsOpen: !this.state.dialogIsOpen,
      snackbarMessage: this.state.snackbarMessage,
      index: this.state.index,
      value: this.props.personList[this.state.index],
      userId: this.props.personList[this.state.index].userId
    })
  },

  _handleSelectValueChange: function (e, index, element) {
    this.setState({
      index: index,
      value: this.props.personList[index],
      userId: element.userId
    })
  },

  handleSign: function () {
    // Players created in this APP (without user)
    if (this.state.userId === null) {
      SignActions.nonUserSignReport(this.props.reportId, this.state.value._id,
        this.state.value.name, this.state.value.teamId, (data, err) => {
          if (err !== null) {
            this.toggleSnackBar(err)
          } else {
            this.toggleDialog()
          }
        })
    } else {
      let signKey = this.refs.pin.getValue()
      // Referee and players with user
      SignActions.userSignReport(this.state.userId, signKey, this.props.reportId,
        this.state.value._id, this.state.value.name,
        this.state.value.teamId, this.state.value.fedId, (data, err) => {
          if (err !== null) {
            this.toggleSnackBar(err)
          } else {
            this.toggleDialog()
          }
        })
    }
  },

  render: function () {
    let customActions = [
      <FlatButton
        key={'dialog-cancel'}
        label='Cancel'
        secondary={true}
        onTouchTap={this.toggleDialog} />,
      <FlatButton
        key={'dialog-accept'}
        label='Sign'
        primary={true}
        onTouchTap={this.handleSign} />
    ]

    let pinComponent = <div></div>
    if (this.state.userId !== null) {
      pinComponent = (
        <TextField ref='pin'
          key={'dialog-pin-field'}
          hintText='Insert your PIN'
          type='password'/>
      )
    }

    let signaturesComponent = (
      this.state.signatures.map((signature, index) => {
        // Person: If Team is the same as passed by properties
        // Referee: If there isn't a Team
        if ((signature.teamId === this.props.teamId) || ((this.props.teamId === null) && (signature.teamId === undefined))) {
          let text = ''
          let time = new Date(signature.timeStamp)
          if (signature.name !== null) {
            text = dateFormat(time, 'dd/mm/yyyy, HH:MM') + ' - ' + signature.name
          }
          return <p key={'signatures-' + index}>{text}</p>
        }
      })
    )
    return (
      <div key={'dialog-div'}>
        <Dialog key={'dialog-edit-person'}
          ref='editDialog'
          title={this.props.title}
          actions={customActions}
          open={this.state.dialogIsOpen}>
          <div style={genericStyle.containerDialog}>
            {pinComponent}
            <br/>
            <SelectField
              ref='teamId'
              displayMember='name'
              menuItems={this.props.personList}
              selectedIndex={this.state.index}
              onChange={this._handleSelectValueChange} />
          </div>
        </Dialog>
        <div style={genericStyle.center}>
          <RaisedButton label='Sign report'
            primary={true}
            onClick={this.toggleDialog} />
          <Snackbar
            ref='snack'
            message={this.state.snackbarMessage}
            autoHideDuration={4000} />
        </div>
        <div style={genericStyle.container}>
          <Card initiallyExpanded={true}>
            <CardHeader
            title='Signatures'
            avatar={
              <Avatar icon={<i className='material-icons'>mode_edit</i>}/>
            }/>
            <CardText>
              {signaturesComponent}
            </CardText>
          </Card>
        </div>
      </div>
    )
  }

})

module.exports = Sign
