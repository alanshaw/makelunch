Meteor.publish('drinkers', function () {
  return Drinkers.find({}, { sort: {name: 1} })
})

Meteor.publish('brews', function () {
  return Brews.find({})
})

Meteor.startup(function () {
  
  //TODO: prevent editing from anonymous users
  Drinkers.allow({
    insert: function (userId, doc) {
      if(!doc.drinks){
        doc.drinks = { given:0, received: 0 }
        doc.brewCount = 0
      }
      return true
    },
    update: function (userId, doc) {
      return true
    }
    // TODO: no deleting, just add a flag to hide if needed.
    // userIds are used like foreign keys in Meal documents
  })

  Brews.allow({
    insert:function (userId, doc) {
      updateStats(doc)
      return true
    },
    update: function (userId, doc) {
      return true;
    }
  })

  // reset stats after change
  Brews.find({}).observeChanges({
    changed: function (id, fields) {
      resetStats()
    }
  })
   
});

function updateStats (brew) {
  updateBrewMasters(brew)
  updateDrinkers(brew)
}

// Update stats for the chef
function updateBrewMasters (brew) {
  Drinkers.update(
    {_id: { $in: brew.master } },
    {
      $inc: { 
        brewCount: 1,
        'drinks.given': brew.drinkers.length
      },
      $set: { lastBrewed: brew.date }
    },
    { multi: true }
  )
}

// Update stats for eaters
function updateDrinkers (brew) {
  Drinkers.update(
    { _id: { $in: brew.drinkers } },
    {  
      $set: { lastDrank: brew.date },
      $inc: { 'drinks.received': 1 }
    },
    { multi: true }
  )
}

// Zero out all the stats and recalculate
function resetStats () {
  Drinkers.update(
    { }, // all
    {  
      $unset: { 
        lastDrank: "",
        lastBrewed: ""
      },
      $set: { 
        brewCount: 0,
        'drinks.given': 0,
        'drinks.received': 0,
      }
    },
    { multi: true }
  )

  Brews.find().fetch().forEach(updateStats)
}

Meteor.methods({
  resetStats: function () {
    resetStats()
  }
})
