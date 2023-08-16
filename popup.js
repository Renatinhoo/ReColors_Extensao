const descriptions = {
  ""              : "Nossa extensão da suporte para varios típos de daltonismo, ajudando a possuir uma melhor navegação web.",
  "Protanopia"    : "Perda de sensibilidade à luz vermelha. Isso é caracterizado por uma tendência a confundir vermelhos e verdes",
  "Protanomaly"   : "",
  "Deuteranopia"  : "",
  "Deuteranomaly" : "",
  "Tritanopia"    : "",
  "Tritanomaly"   : ".",
  "Achromatopsia" : "",
  "Achromatomaly" : ""
};

const clearFilter = (image, filterId) => {
  setFilter(image, "");
  deactive(filterId);
};

const setActive = filterId => {
  if (filterId) {
    document.getElementById(filterId).className = "active";
  }
};

const deactive = filterId => {
  if (filterId) {
    document.getElementById(filterId).className = "";
  }
};

const setFilter = (image, filter) => {
  setActive(filter);

  let filterDes = document.getElementById('filter-description');
  filterDes.innerHTML = descriptions[filter];

  let filterURL = `url('#${filter.toLowerCase()}')`;

  image.style.filter = filterURL;

 
  chrome.storage.sync.set({'filter':filter}, () => {
  });

  
  chrome.tabs.getSelected(function(tab){
    chrome.tabs.sendMessage(tab.id, {
      action: 'render',
      type: filter
    });
  });
};

const toggleOnOff = () => {
  let off = document.getElementsByClassName("off")[0];
  let on  = document.getElementsByClassName("on")[0];

  if (on.className === "on") {
  console.log(on);
    off.className = "off";
    off.style.backgroundColor = "white";
    on.className += " active";
    on.style.backgroundColor = "green";
  } else if (off.className === "off") {
    on.className = "on";
    on.style.backgroundColor = "white";
    off.className += " active";
    off.style.backgroundColor = "red";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let list = document.getElementsByTagName('li');
  let image = document.getElementsByTagName('body')[0];
  let currentFilter = "Protanopia";

  list = Array.prototype.slice.call(list);
  injectSVG();

  chrome.storage.sync.get(["filter"], (savedFilter) => {
    filter = savedFilter.filter;
    if (filter !== "") {
      toggleOnOff();
      currentFilter = filter;
    }
    setFilter(image, filter);
  });

  document.getElementById('about').addEventListener("click", e => {
    e.preventDefault();
    let newURL = "https://github.com/yTrosky";
    chrome.tabs.create({ url: newURL });
  });

  list.forEach(li => {
    li.addEventListener('click', e => {
      if (document.getElementsByClassName("off")[0].className !== "off") {

        toggleOnOff();
      }
      deactive(currentFilter);
      currentFilter = e.target.textContent;
      setFilter(image, currentFilter);
    });
  });

  document.getElementsByClassName("on")[0].addEventListener("click", () => {
    toggleOnOff();
    if (!currentFilter) {
      currentFilter = "Protanopia";
    }
    setFilter(image, currentFilter);
  });

  document.getElementsByClassName("off")[0].addEventListener("click", () => {
    toggleOnOff();
    clearFilter(image, currentFilter);
  });
});
