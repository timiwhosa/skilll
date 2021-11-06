document.addEventListener("DOMContentLoaded", () => {
  // document
  //   .getElementsByClassName("search-div")[0]
  //   .addEventListener("mouseenter", () => opensearch());
  // document
  //   .getElementsByClassName("width")[0]
  //   .addEventListener("mouseenter", () => closesearch());
});

// Escape text
String.prototype.escape = function () {
  var tagtoreplace = {
    "&": "&amp;",
    "<": "&lt",
    ">": "&gt",
    "=": "",
    script: " ",
    Script: " ",
    '"': " ",
    "`": " ",
  };
  return this.replace(/[&<>`=]/g, function (tag) {
    return tagtoreplace[tag] || tag;
  });
};

// SEARCH section
if (
  (document.getElementsByClassName("search-btn")[0],
  document.getElementById("searchForm"),
  document.getElementById("school"),
  document.getElementById("join-form"))
) {
  // search input
  var searchInput = document.getElementById("search");
  searchInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      search(e.target.value);
    }
  });
  // adding event listener to search-select your school
  document
    .getElementById("school")
    .addEventListener("keyup", saveSelectSchool);
  // setting select value to localStoragechoosen school
  var school = JSON.parse(localStorage.getItem("skilll-school"));
  if (school) {
    document.getElementById("school").value = school.school;
  }

  // eventlistener for search form
  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    return false;
  });
  // eventlistener for search button
  document
    .getElementsByClassName("search-btn")[0]
    .addEventListener("pointerdown", (e) => {
      search(searchInput.value);
    });

  // Join form
  var join = document.getElementById("join-form");
  join.addEventListener("submit", (e) => {
    e.preventDefault();
    Join(e);
    return false;
  });
}

// save selected school to localStorage
function saveSelectSchool(e) {
  document.getElementById("school").classList.remove("redBorder");
  if (e.target.value.trim().length > 0) {
    localStorage.setItem(
      "skilll-school",
      JSON.stringify({ school: e.target.value.trim() })
    );
  }
}

function search(searchValue) {
  var school = JSON.parse(localStorage.getItem("skilll-school"));
  // console.log(e)
  // searchValue = e.target.parentElement.previousElementSibling.children[0].value;

  // get the value for input field lol
  if (searchValue.trim().length > 0) {
    if (school && school.school) {
      fetch(`/search?keyword=${searchValue}&school=${school.school}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === 200) {
            data.keyword = searchValue
            savesearch(data);
            loadList(data.data);
            console.log(data);
          } else {
            messageDiv(data);
          }
        });
    } else {
      document.getElementById("school").classList.add("redBorder");
    }
  }
}

function savesearch(data) {
  sessionStorage.setItem("SkilllsearchResult", JSON.stringify(data, null, 2));
}
function messageDiv(data) {
  var suc = document.createElement("div");
  var messageCtn = document.createElement("div");
  var Close = document.createElement("div");
  var btn = document.createElement("button");
  
  suc.setAttribute("class", "message");
  if (data.status === 208) {
    suc.classList.add("bg-red")
  }
  messageCtn.setAttribute("class", "message-ctn");
  Close.setAttribute("class", "close-message");

  btn.textContent = "Close";


  suc.setAttribute("id", `Response${Math.floor(Math.random())}`);
  messageCtn.textContent = data.message;

  Close.addEventListener("click", () => {
    document.body.removeChild(suc);
  })

  Close.appendChild(btn);
  suc.appendChild(messageCtn);
  suc.appendChild(Close);

  document.body.append(suc);
}


function Join(e) {
  var name = e.target[0].value.trim().escape();
  var number = e.target[1].value;
  var school = e.target[2].value.trim().escape();
  var skilll = e.target[3].value.trim().escape();
  var portfolio = e.target[4].value.trim().escape();
  var twitter = e.target[5].value.trim().escape();
  var password = e.target[6].value.trim();
  var confirmPassword = e.target[7].value.trim();

  if (password === confirmPassword) {
    if (
      (name,
      number,
      school,
      skilll,
      portfolio,
      twitter,
      password,
      confirmPassword)
    ) {
      fetch("/joinSkilll", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          number,
          school,
          skilll,
          portfolio,
          twitter,
          password
        })
      })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            messageDiv(data);
          })
    }
  } else {
    var passError = document.getElementById("password-error");
    e.target[6].addEventListener("keyup", () => {
      passError.classList.add("hide");
    });
    passError.classList.remove("hide");
  }
}

document.getElementById("close-list").addEventListener("click", closeList);
function closeList() {
  document.getElementsByClassName("search-list")[0].style.display = "none";
  document.body.style.heportfolioht= "auto";
  document.body.style.overflowY="scroll"
}
function showList() {
  document.getElementsByClassName("search-list")[0].style.display = "block";
  document.body.style.heportfolioht= "100vh";
  document.body.style.overflowY="hidden"
}

function setListHead() {
  var searchResult = JSON.parse(sessionStorage.getItem("SkilllsearchResult"));
  var school = JSON.parse(localStorage.getItem("skilll-school"));

  document.getElementById("numberofpeople").innerText = searchResult.data.length;
  document.getElementById("keyword").innerText = searchResult.keyword;
  document.getElementById("searchedSchool").innerText = school.school;
}
function loadList(data) {
  showList();
  setListHead();
  var i = 0;
  document.getElementsByClassName("search-list-list")[0].children[0].innerHTML = "";

  for (i; i < data.length; i++){
    var li = document.createElement("li");
    var person = document.createElement("div");
    person.setAttribute("class", "person");

    var personLeft = document.createElement("div");
    personLeft.setAttribute("class", "person-left");

    var name = document.createElement("div");
    name.setAttribute("class", "name");

    name.textContent = data[i].name;

    var personSkill = document.createElement("div");
    personSkill.setAttribute("class", "person-skilll");
    personSkill.textContent = data[i].skill;

    var ul = document.createElement("ul");
    ul.setAttribute("class", "flex");
    var EditLi = document.createElement("li");
    EditLi.setAttribute("class", "edit");
    var editBtn = document.createElement("button");
    editBtn.setAttribute("onclick", `edit('${data[i]._id}')`);
    editBtn.textContent = "Edit";
    EditLi.appendChild(editBtn);

    var SocialLi = document.createElement("li");
    SocialLi.setAttribute("class", "person-social flex");

    var portfoliobtn = document.createElement("button");
    var portfolioLink = document.createElement("a");
    var portfolioImg = document.createElement("img");

    // append instagram details
    portfolioImg.setAttribute("src", "/img/social/portfolio.png");
    portfolioLink.setAttribute("href", `${data[i].portfolio}`);
    portfolioLink.appendChild(portfolioImg);
    portfoliobtn.appendChild(portfolioLink);

    var twitterbtn = document.createElement("button");
    var twitterLink = document.createElement("a");
    var twitterImg = document.createElement("img");

    // append twitter details
    twitterImg.setAttribute("src", "/img/social/twitter.png");
    twitterLink.appendChild(twitterImg);
    twitterLink.setAttribute("href", `${data[i].twitter}`);
    twitterbtn.appendChild(twitterLink);

    // var linkedinbtn = document.createElement("button");
    // var linkedinLink = document.createElement("a");
    // var linkedinImg = document.createElement("img");

    // append linkedin details
    // linkedinImg.setAttribute("src", "/img/social/linkedin.png");
    // linkedinLink.appendChild(linkedinImg);
    // linkedinLink.setAttribute("href", "https://linkedin.com");
    // linkedinbtn.appendChild(linkedinLink);

    SocialLi.appendChild(portfoliobtn);
    SocialLi.appendChild(twitterbtn);
    // SocialLi.appendChild(linkedinbtn);

    ul.appendChild(EditLi);
    ul.appendChild(SocialLi);

    personLeft.appendChild(name);
    personLeft.appendChild(personSkill);
    personLeft.appendChild(ul);

    person.appendChild(personLeft);
    li.appendChild(person);

    document
      .getElementsByClassName("search-list-list")[0]
      .children[0].appendChild(li);
  }
}
// loadList("data");

function edittoogle() {
  if (
    document.getElementsByClassName("edit-card")[0].style.display === "none" ||
    document.getElementsByClassName("edit-card")[0].style.display === ""
  ) {
    document.getElementsByClassName("edit-card")[0].style.display = "block";
    document.getElementsByClassName("general-cover")[0].style.display = "block";
  } else {
    document.getElementsByClassName("edit-card")[0].style.display = "none";
    document.getElementsByClassName("general-cover")[0].style.display = "none";
  }
}
document
  .getElementsByClassName("close-edit")[0]
  .addEventListener("click", edittoogle);
document
  .getElementsByClassName("general-cover")[0]
  .addEventListener("click", edittoogle);

function edit(id) {
  edittoogle();
  var searchResult = JSON.parse(sessionStorage.getItem("SkilllsearchResult"));
  var editForm = document.getElementById("edit-form");
  var editName = document.getElementById("edit-name");
  var editSchool = document.getElementById("edit-school");
  var editPortfolio = document.getElementById("edit-portfolio");
  var editTwitter = document.getElementById("edit-twitter");
  var editSkill = document.getElementById("edit-skilll");
  if (searchResult) {
    console.log(searchResult)
    var t = searchResult.data.filter((dat) => {
      if (dat._id === id) {
        editName.value = dat.name;
        editSchool.value = dat.school;
        editPortfolio.value = dat.portfolio;
        editTwitter.value = dat.twitter;
        editSkill.value = dat.skill;
        sessionStorage.setItem("myId", JSON.stringify(dat._id,null,2))
      };
    })
    // for (i = 0; i < searchResult.data.length; i++){
    //   console.log(searchResult.data[i])
    // }
    
  }

}

document.getElementById("edit-form").addEventListener("submit", uploadChanges);
function uploadChanges(e) {
  e.preventDefault();

  var name = e.target[0].value.trim().escape();
  var school = e.target[1].value.trim().escape();
  var portfolio = e.target[2].value.trim().escape();
  var twitter = e.target[3].value.trim().escape();
  var skill = e.target[4].value.trim().escape();
  var password = e.target[5].value.trim();

  var myId = JSON.parse(sessionStorage.getItem("myId"));
  
   if (
     (name,
     school,
     skill,
     portfolio,
     twitter,
     password, myId)
   ) {
     if(name.length<20 &&
school.length<10 &&
skill.length<60 &&
portfolio.length<70 &&
twitter.length<70 )
     fetch("/UpdateSkilll", {
       method: "POST",
       headers: { "content-type": "application/json" },
       body: JSON.stringify({
         name,
         school,
         skill,
         portfolio,
         twitter,
         password, myId
       })
     }).then((res) => {
           return res.json();
         })
         .then((data) => {
           messageDiv(data);
         }).catch((err) => {
           console.error(err);
         })
   }
}
