Make Tea!
=========

Help figure out who's making tea next by recording stats on how many teas you've made vs how many you've received.

If I make tea for 8 people (including me), I recieve 1 portion and give 8, so am +7

Brews are historical records. The stats on the Drinkers are calculated on tea insert. It's an experiment in document storage style.

To recommend who makes tea next we look at how has the lowest value of `drinks.given` - `drinks.recieved`.

Routes
------

`/` = stats & recommendations
`/adddrink` = create new drink data
`/addperson` = create new people


Collections
-----------

**Brews**
```
{
  date: isoDate
  master: [userId]
  drinkers: [userId]
  guests: Integer
}
```

**Drinkers**
```
{
  name: String,
  img: url,
  drinks: {
    given: Integer,
    received: Integer
  }
  brewCount: Interger,
  lastBrewed: isoDate,
  lastDrank: isoDate
}
```