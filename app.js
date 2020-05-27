/**
 * Bu app muhasebeciye musteri listesini tutmaya yarar
 * CRM ==> Customer Relationship Management.
 * 
 *  Akis
 *  ====
 *  - Istenen özeliklerin cizimine bak
 *  - ekrani ikiye böl 
 *  - Sol tarafta Her yeni musteriyi kayit edebilmeli isim, Soyisim ve telefon girebilmeli, girilince kaydet
 *  - Kaydet butonuna basildiginda ekranin sag tarafina yazdir
 *  - Arama inputu olsun ve sadece aranan sonucu göstersin
 * 
 *  Analiz
 *  ======
 *  - solda uc input olsun birde kaydet butonu
 *  - sagda Baslik arama inputu ve musteri listesi
 */


let name = document.querySelector("#clientFirstName");
let surName = document.querySelector("#clientLastName");
let phone = document.querySelector("#phoneNumber");
let SaveBtn = document.querySelector("#SaveBtn");
let aramaKutusu = document.querySelector("#aramaKutusu");
let removeBtn = document.querySelector(".remove-btn");
let clientsListBox = document.querySelector(".clients-list-box");
let dBName = "Muhasebe";
let searchData = [];

class DbManager {
  getItem() {
    let people;
    if (localStorage.getItem(dBName) === null) {
      people = [];
      return people;
    }
    people = JSON.parse(localStorage.getItem(dBName));
    return people;
  }

  setItem(person) {
    let people = this.getItem();
    people.push(person);
    localStorage.setItem(dBName, JSON.stringify(people));
  }
  findItem(phone) {
    if (this.getItem().some(item => item.phone === phone)) {
      return true;
    }
  }
  removeItem(id) {
    let people = this.getItem();
    let position = people.findIndex(e => e.phone === id);
    people.splice(position, 1);
    this.updateItem(people);
  }
  updateItem(data) {
    localStorage.setItem(dBName, JSON.stringify(data))
  }
}

function addPersonToList(person) {
  clientsListTemplate = `
     <tr id="${person.phone}">
        <td>${person.name}</td>
        <td>${person.surName}</td>
        <td>${person.phone}</td>
        <td class="remove-btn">X</td>
     </tr>
  `
  clientsListBox.innerHTML += clientsListTemplate;
}




SaveBtn.addEventListener("click", function () {
  const person = {
    name: name.value,
    surName: surName.value,
    phone: phone.value
  }
  let db = new DbManager();

  if (name.value === "" || surName.value === "" || phone.value === "") {
    alert("Bos alan birakma")
    return
  }
  if (db.findItem(phone.value)) {
    alert("Bu kisi kayitli");
    return
  }
  addPersonToList(person);
  db.setItem(person);
  name.value = "";
  surName.value = "";
  phone.value = "";
})

aramaKutusu.addEventListener("input", function (e) {
  let keyWord = e.target.value;
  let db = new DbManager();
  let people = db.getItem();
  clientsListBox.innerHTML = "";
  if (keyWord.length <= 2) {
    searchData = [];
    init();
    return;
  }
  searchView(people, keyWord);
})

function searchView(allData, keyWords) {
  allData.forEach(item => {
    for (key in item) {
      if (item[key].indexOf(keyWords) != -1) {
        if (searchData.some(i => i.phone === item.phone)) {
          return
        }
        searchData.push(item);
      }
    }
  });
  searchData.forEach(person => {
    addPersonToList(person);
  })
}

clientsListBox.addEventListener("click", function (e) {
  let eTarget = e.target;
  let itemId = e.target.parentElement.getAttribute("id");
  let db = new DbManager();
  if (eTarget.classList.contains("remove-btn")) {
    if (window.confirm("Silmek istediginizden eminmisiniz ?")) {
      eTarget.parentElement.remove();
      db.removeItem(itemId);
    }
  }
})

function init() {
  let db = new DbManager();
  let allData = db.getItem();
  allData.forEach(person => {
    addPersonToList(person);
  });
}
init();