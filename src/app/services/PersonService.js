import InstanceNotFoundException from '../models/exception/InstanceNotFoundException'
import PersonDao from '../daos/PersonDao'

class PersonService {

  constructor (reportService, teamService, authService) {
    this.ReportService = reportService
    this.TeamService = teamService
    this.AuthService = authService
  }
  /**
    * Get an unique Person from a team in this report
    * @param {String} personId The person identifier
    * @param {String} reportId The report identifier
    * @param {String} teamId The team identifier
    * @param {personCallback} callback A callback that returns an element
    */
  findByPersonIdReportIdAndTeamId (personId, reportId, teamId, callback) {
    PersonDao.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, callback)
  }

  /**
    * Get a list of People from a team in this report
    * @param {String} reportId The report identifier
    * @param {String} teamId The team identifier
    * @param {personListCallback} callback A callback that returns a list
    */
  findByReportIdAndTeamId (reportId, teamId, callback) {
    PersonDao.findByReportIdAndTeamId(reportId, teamId, callback)
  }

  /**
    * Get a list of People in a Report
    * @param {String} reportId The report identifier
    * @param {personListCallback} callback A callback that returns a list
    */
  findAllByReportId (reportId, callback) {
    PersonDao.findAllByReportId(reportId, callback)
  }

  /**
    * Create a new Person
    * @param {String} name The report identifier
    * @param {String} cardId The card identification number
    * @param {String} dorsal The dorsal number
    * @param {String} avatarUrl The url where the avatar is hosted
    * @param {Boolean} isCalled Value that checks if this Person is called by this Team in this Report
    * @param {Boolean} isStaff Value that checks if this Person is a staff
    * @param {String} reportId The report identifier
    * @param {String} teamId The team identifier
    * @param {String} userId The user identifier
    * @param {personCallback} callback A callback that returns an element
    */
  create (name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, callback) {
    // Check if the Report exists
    this.ReportService.findById(reportId, (report, err) => {
      if (err !== null) {
        return callback(null, new InstanceNotFoundException('Non existent report', 'person.reportId', reportId))
      }
      // Check if the Team exists
      this.TeamService.findById(teamId, (team, err) => {
        if (err !== null) {
          return callback(null, new InstanceNotFoundException('Non existent team', 'person.teamId', teamId))
        }
        // If userId not null, check if User exists
        // userId === null means that this Person that is going to be created is a temporal Person
        if (userId !== null) {
          this.AuthService.findById(userId, (user, err) => {
            if (err !== null) {
              return callback(null, new InstanceNotFoundException('Non existent user', 'person.userId', userId))
            }
            // Save it
            PersonDao.create(name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, callback)
          })
        } else {
          // Save it
          PersonDao.create(name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, callback)
        }
      })
    })
  }

  /**
    * Update a Person
    * @param {String} personId The Person identifier
    * @param {String} name The report identifier
    * @param {String} cardId The card identification number
    * @param {String} dorsal The dorsal number
    * @param {String} avatarUrl The url where the avatar is hosted
    * @param {Boolean} isCalled Value that checks if this Person is called by this Team in this Report
    * @param {Boolean} isStaff Value that checks if this Person is a staff
    * @param {String} reportId The report identifier
    * @param {String} oldTeamId The old team identifier
    * @param {String} teamId The new team identifier
    * @param {String} userId The user identifier
    * @param {personCallback} callback A callback that returns an element
    */
  update (personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, oldTeamId, teamId, userId, callback) {
    // Get person
    this.findByPersonIdReportIdAndTeamId(personId, reportId, oldTeamId, (oldPerson, err) => {
      if (err !== null) {
        PersonDao.update(personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, oldTeamId, teamId, userId, oldPerson, callback)
      } else {
        callback(null, new InstanceNotFoundException('Non existent person', 'personId', personId))
      }
    })
  }

  /**
    * Set a new value to isCalled property
    * @param {String} personId The Person identifier
    * @param {String} reportId The report identifier
    * @param {String} teamId The new team identifier
    * @param {Boolean} newValue The new value to isCalled property
    * @param {personCallback} callback A callback that returns an element
    */
  setCalledValue (personId, reportId, teamId, newValue, callback) {
    // Get person
    this.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, (oldPerson, err) => {
      if (err === null) {
        // Update it
        PersonDao.update(personId, reportId, teamId, newValue, oldPerson, callback)
      } else {
        callback(null, new InstanceNotFoundException('Non existent person', 'personId', personId))
      }
    })
  }

  /**
    * Set a new value to dorsal property
    * @param {String} personId The Person identifier
    * @param {String} reportId The report identifier
    * @param {String} teamId The new team identifier
    * @param {String} newDorsal The new dorsal value
    * @param {personCallback} callback A callback that returns an element
    */
  setDorsal (personId, reportId, teamId, newDorsal, callback) {
    // Get person
    this.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, (oldPerson, err) => {
      if (err === null) {
        // Update it
        PersonDao.update(personId, reportId, teamId, newDorsal, oldPerson, callback)
      } else {
        callback(null, new InstanceNotFoundException('Non existent person', 'personId', personId))
      }
    })
  }

  /**
    * Delete a person indentified by personId, reportId and teamId
    * @param {Number} personId The Person identifier
    * @param {Number} reportId The report identifier
    * @param {Number} teamId The new team identifier
    * @param {personCallback} callback A callback that returns if the delete was correctly
    */
  deletePerson (personId, reportId, teamId, callback) {
    this.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, function (person, err) {
      if (err === null) {
        // Remove it
        PersonDao.remove(person, callback)
      } else {
        callback(null, new InstanceNotFoundException('Non existent person', 'personId', personId))
      }
    })
  }

  /**
    * Delete all Person from a Report
    * @param {String} reportId The report identifier
    * @param {personCallback} callback A callback that returns if all Person were removed
    */
  deleteAllPersonByReportId (reportId, callback) {
    this.findAllByReportId(reportId, function (personList, err) {
      // Remove all person
      personList.map((person) => {
        PersonDao.remove(person, function (res, err) {
          if (err !== null) {
            return callback(null, err)
          }
        })
      })
      callback(personList, err)
    })
  }

}

module.exports = PersonService
