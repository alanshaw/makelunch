Meteor.subscribe('drinkers')

Meteor.startup(function () {

  Router.map(function () {
    
    this.route('home', { 
      path:'/' ,
      data: function () {
        return {
          people: Drinkers.find({}).fetch()
            .map(function (e) {
              e.img = e.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(e.name) + "?s=300&d=monsterid"
              return e
            })
            .sort(scoreSort),
          whoShouldBrew: whoShouldBrew()
        }
      }
    })
    
    this.route('addbrew', {
      path:'/brews/add',
      data: function () {
        return {
          people: Drinkers.find({})
        }
      }
    })

    this.route('addperson', {path: '/drinkers/add'})

    this.route('brews', {
      path:'/brews',
      before: [
        function () {
          this.subscribe('brews')
        }
      ],
      data: function () {
        return {
          brews: Brews.find({}, {sort: {date: -1}}).fetch()
        }
      }
    })

  })// end router.map

})// end Meteor.startup

Handlebars.registerHelper('fromNow', function (date) {
  return moment(date).fromNow()
})

Handlebars.registerHelper('profile', function (userId) {
  var drinker = Drinkers.findOne(userId)
  drinker.img = drinker.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(drinker.name) + "?s=300&d=monsterid"
  return drinker
})

function scoreSort (a, b) {
  if (score(a) === score(b)) {
    var aLastCooked = a.lastBrewed || "1970-01-01"
    var bLastCooked = b.lastBrewed || "1970-01-01"

    if (moment(aLastCooked).isSame(bLastCooked)) {
      return 0
    } else if (moment(aLastCooked).isBefore(bLastCooked)) {
      return -1
    } else {
      return 1
    }
  }
  if (score(a) > score(b)) return 1;
  return -1
}

function whoShouldBrew() {
  var drinkers = Drinkers.find().fetch()
  
  drinkers.sort(scoreSort)

  return drinkers[0]
}

function score (person){
  if(!person || !person.servings) return 0;
  return person.drinks.given - person.drinks.received
}

function addBrewFormSelect2 () {
  $(".brewMaster").select2({formatNoMatches: function () {return ""}})
  $(".brewDrinkers").select2({formatNoMatches: function () {return ""}})
}

Template.brews.formatDate = function (date) {
  return date.replace('T', ' ')
}

Template.addbrew.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var brew = {
      date: tpl.find('.brewDate').value + 'T' + tpl.find('.brewTime').value,
      master: $('.brewMaster').select2("val"),
      drinkers: $('.brewDrinkers').select2("val"),
      guests: parseInt(tpl.find('.brewGuests').value, 10)
    }

    console.log(brew)

    Brews.insert(brew, function (er) {
      if (er) return console.error(er)
      window.location = "/brews"
    })
  }
}

Template.addbrew.dateNow = function () {
  return todaysDate()
}

Template.addbrew.timeNow = function () {
  return moment().format("HH:mm")
}

Template.addbrew.rendered = function() {
  addBrewFormSelect2()
}

Template.addperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var person = {
      name: tpl.find('.personName').value,
      img: tpl.find('.personImg').value
    }

    console.log(person)

    Drinkers.insert(person, function (er) {
      if (er) return console.error(er)
      window.location = "/"
    })
  }
}