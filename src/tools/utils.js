export function add(a, b) {
  return a + b;
}

export function sortWords(data) {
  let allWords = [];

  data.forEach(el => {
    let sentence = removePunctuation(el.text);
    let words = sentence.split(" ");
    words.forEach(word => {
      allWords.push(word.toLowerCase());
    });
  });

  return filterWords(allWords);
}

function filterWords(data) {
  let checkWords = new Object();
  // let words = [];

  data.forEach(word => {
    if (!checkWords[word]) {
      checkWords[word] = 1;
    } else {
      checkWords[word]++;
    }
  });
  return sortProperties(checkWords);
}

function sortProperties(obj) {
  // convert object into array
  var sortable = [];
  for (var key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      sortable.push([key, obj[key]]);
    }
  }
  // sort items by value
  sortable.sort(function(a, b) {
    return b[1] - a[1]; // compare numbers
  });
  return toObject(sortable);
}

function toObject(arr) {
  var rv = [];
  arr.forEach(el => {
    rv.push({
      word: el[0],
      number: el[1]
    });
  });
  return rv;
}

function removePunctuation(string) {
  var regex = /[!"#$%&'’()*+,-./:;<=>?@[\]^_`{|}~1234567890]/g;
  return string.replace(regex, "");
}

export function filterMovies(data, numberMovie) {
  let checkPeople = new Object();
  let people = [];
  let linksWithoutId = [];
  let id = 0;
  let idLinks = 0;

  data.forEach(el => {
    idLinks++;
    if (!checkPeople[el.from] || !checkPeople[el.to]) {
      if (!checkPeople[el.from]) {
        id++;
        checkPeople[el.from] = id;
        people.push({
          id,
          name: el.from,
          img: `../../assets/img/characters/${numberMovie}/${el.from.replace(
            /\s/g,
            "-"
          )}.jpeg`,
          number: 0
        });
      } else if (!checkPeople[el.to]) {
        id++;
        checkPeople[el.to] = id;
        people.push({
          id,
          name: el.to,
          img: `../../assets/img/characters/${numberMovie}/${el.to.replace(
            /\s/g,
            "-"
          )}.jpeg`,
          number: 0
        });
      }
    }

    linksWithoutId.push({
      source: el.from,
      target: el.to,
      number: 0,
      id: idLinks
    });
  });

  return changeNamesToId(linksWithoutId, people);
}

function changeNamesToId(data, ids) {
  const filteredArr = data.reduce((acc, current) => {
    const x = acc.find(
      item => item.target === current.target && item.source === current.source
    );
    if (!x) {
      current.number = 1;
      return acc.concat([current]);
    } else {
      let index = acc.findIndex(
        x => (x.source === current.source) & (x.target === current.target)
      );
      acc[index].number++;
      return acc;
    }
  }, []);

  const finalArr = reduce(filteredArr);

  finalArr.forEach(el => {
    ids.forEach(i => {
      if (i.name === el.target || i.name === el.source) {
        i.number += el.number;
      }
    });
  });

  ids = sortArray(ids);
  ids.forEach((el, i) => {
    el.id = i + 1;
  });

  finalArr.forEach(el => {
    ids.forEach(people => {
      if (el.source === people.name) {
        el.source = people.id;
      }
      if (el.target === people.name) {
        el.target = people.id;
      }
    });
  });

  return {
    nodes: ids,
    links: finalArr
  };
}

function reduce(arr) {
  let filteredArr = [];

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    let index = arr.findIndex(
      x => x.source === current.target && x.target === current.source
    );

    if (index < 0) {
      filteredArr.push(current);
    } else {
      let inFilteredIndex = filteredArr.findIndex(
        y => y.source === current.target && y.target === current.source
      );

      if (inFilteredIndex < 0) {
        let objPush = {
          source: current.source,
          target: current.target,
          number: current.number + arr[index].number,
          id: current.id
        };
        filteredArr.push(objPush);
      }
    }
  }

  return filteredArr;
}

function sortArray(arr) {
  return arr.concat().sort(compare);
}

function compare(a, b) {
  let comparison = 0;
  if (a.number > b.number) {
    comparison = -1;
  } else if (a.number < b.number) {
    comparison = 1;
  }
  return comparison;
}
