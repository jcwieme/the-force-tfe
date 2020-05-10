export function add(a, b) {
  return a + b
}

export function checkSize(x) {
  if (x.innerWidth > 1024) {
    return false
  } else {
    return true
  }
}

// Preloads Images
export function preloadImages(urls, allImagesLoadedCallback) {
  var loadedCounter = 0
  var toBeLoadedNumber = urls.length
  urls.forEach(function(url) {
    preloadImage(url, function() {
      loadedCounter++
      // console.log('Number of loaded images: ' + loadedCounter)
      if (loadedCounter == toBeLoadedNumber) {
        allImagesLoadedCallback()
      }
    })
  })
  function preloadImage(url, anImageLoadedCallback) {
    var img = new Image()
    img.onload = anImageLoadedCallback
    img.src = url.link
  }
}

export function sortWords(data, numberMovie) {
  let allWords = []

  data.forEach(el => {
    let sentence = removePunctuation(el.text)
    let words = sentence.split(' ')
    words.forEach(word => {
      if (word === '' || word.length === 1) return
      allWords.push({
        word: word.toLowerCase(),
        from: [
          {
            character: el.from,
            number: 1,
            path: `../../assets/img/characters/${numberMovie}/${el.from.replace(
              /\s/g,
              '-'
            )}.jpeg`,
          },
        ],
        number: 1,
      })
    })
  })

  return filterWords(allWords)
}

function filterWords(data) {
  let checkWords = []

  data.forEach(obj => {
    if (!checkWords.find(element => element.word === obj.word)) {
      checkWords.push({
        word: obj.word,
        from: obj.from,
        number: 1,
      })
    } else {
      let index = checkWords.findIndex(element => element.word === obj.word)
      checkWords[index].number += obj.number

      if (
        checkWords[index].from.find(
          el => el.character === obj.from[0].character
        )
      ) {
        let charcIndex = checkWords[index].from.findIndex(
          element => element.character === obj.from[0].character
        )

        checkWords[index].from[charcIndex].number += obj.from[0].number
      } else {
        checkWords[index].from.push(obj.from[0])
      }
    }
  })

  checkWords.forEach(el => {
    el.from = sortArray(el.from)
  })

  return sortArray(checkWords)
}

function removePunctuation(string) {
  var regexSpace = /[!"#$%&'’()*+,./:;<=>?@[\]^_`{|}~1234567890]/g
  var regexNoSpace = /['’]/g
  string = string.replace(regexSpace, ' ')
  string = string.replace(regexNoSpace, '')
  string = string.replace(/\s{2,}/g, ' ')
  return string
}

export function filterMovies(data, numberMovie) {
  let checkPeople = new Object()
  let people = []
  let linksWithoutId = []
  let id = 0
  let idLinks = 0

  data.forEach(el => {
    idLinks++
    if (!checkPeople[el.from] || !checkPeople[el.to]) {
      if (!checkPeople[el.from]) {
        id++
        checkPeople[el.from] = id
        people.push({
          id,
          name: el.from,
          img: `../../assets/img/characters/${numberMovie}/${el.from.replace(
            /\s/g,
            '-'
          )}.jpeg`,
          number: 0,
        })
      } else if (!checkPeople[el.to]) {
        id++
        checkPeople[el.to] = id
        people.push({
          id,
          name: el.to,
          img: `../../assets/img/characters/${numberMovie}/${el.to.replace(
            /\s/g,
            '-'
          )}.jpeg`,
          number: 0,
        })
      }
    }

    linksWithoutId.push({
      source: el.from,
      target: el.to,
      number: 0,
      id: idLinks,
    })
  })

  return changeNamesToId(linksWithoutId, people)
}

function changeNamesToId(data, ids) {
  const filteredArr = data.reduce((acc, current) => {
    const x = acc.find(
      item => item.target === current.target && item.source === current.source
    )
    if (!x) {
      current.number = 1
      return acc.concat([current])
    } else {
      let index = acc.findIndex(
        x => (x.source === current.source) & (x.target === current.target)
      )
      acc[index].number++
      return acc
    }
  }, [])

  const finalArr = reduce(filteredArr)

  finalArr.forEach(el => {
    ids.forEach(i => {
      if (i.name === el.target || i.name === el.source) {
        i.number += el.number
      }
    })
  })

  ids = sortArray(ids)
  ids.forEach((el, i) => {
    el.id = i + 1
  })

  finalArr.forEach(el => {
    ids.forEach(people => {
      if (el.source === people.name) {
        el.source = people.id
      }
      if (el.target === people.name) {
        el.target = people.id
      }
    })
  })

  return {
    nodes: ids,
    links: finalArr,
  }
}

function reduce(arr) {
  let filteredArr = []

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i]
    let index = arr.findIndex(
      x => x.source === current.target && x.target === current.source
    )

    if (index < 0) {
      filteredArr.push(current)
    } else {
      let inFilteredIndex = filteredArr.findIndex(
        y => y.source === current.target && y.target === current.source
      )

      if (inFilteredIndex < 0) {
        let objPush = {
          source: current.source,
          target: current.target,
          number: current.number + arr[index].number,
          id: current.id,
        }
        filteredArr.push(objPush)
      }
    }
  }

  return filteredArr
}

function sortArray(arr) {
  return arr.concat().sort(compare)
}

function compare(a, b) {
  let comparison = 0
  if (a.number > b.number) {
    comparison = -1
  } else if (a.number < b.number) {
    comparison = 1
  }
  return comparison
}
