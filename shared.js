Today = new Meteor.Collection('Today')

Brews = new Meteor.Collection('Brews')

Drinkers = new Meteor.Collection('Drinkers')

// returns todays date as 2014-02-09
todaysDate = function todaysDate () {
  return new Date().toISOString().split('T')[0]
}