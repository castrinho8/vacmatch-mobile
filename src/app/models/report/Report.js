
class Report {

  constructor (id, date, location, hasFinished, localTeam, visitorTeam, refereeList) {
    this._id = id
    this.databaseType = 'report'
    this.date = date
    this.location = location
    this.hasFinished = hasFinished
    this.localTeam = {
      _id: localTeam ? localTeam._id : null,
      name: localTeam ? localTeam.name : null,
      result: localTeam ? localTeam.result : '0',
      secondaryField: localTeam ? localTeam.secondaryField : '0'
    }
    this.visitorTeam = {
      _id: visitorTeam ? visitorTeam._id : null,
      name: visitorTeam ? visitorTeam.name : null,
      result: visitorTeam ? visitorTeam.result : '0',
      secondaryField: visitorTeam ? visitorTeam.secondaryField : '0'
    }
    this.incidences = ''
    this.refereeList = refereeList
  }

}

module.exports = Report
