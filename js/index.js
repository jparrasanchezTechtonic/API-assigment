
// const baseUrl = 'https://swapi.co/api';
// CREATE A DB
// window.db = new Dexie('localbitcoins');
// // db.version(1).stores({datos: "ad_id,atm_model,bank_name,city,countrycode,created_at,currency,first_time_limit_btc," +
// // + ",hidden_by_opening_hours,is_local_office,is_low_risk,lat,limit_to_fiat_amounts,location_string,lon,max_amount," +
// // + "max_amount_available,min_amount,msg,online_provider,payment_window_minutes,feedback_score,last_online,name,trade_count, " +
// // + "username,require_feedback_score,require_identification,require_trade_volume,require_trusted_by_advertiser, " +
// // + "sms_verification_required,temp_price,temp_price_usd,trade_type,trusted_required,visible,volume_coefficient_btc"});
// var dbSchema = {datos:"ad_id, atm_model, bank_name city, countrycode, created_at, currency, first_time_limit_btc, hidden_by_opening_hours, is_local_office, is_low_risk, lat, limit_to_fiat_amounts, location_string, lon, max_amount, max_amount_available, min_amount, msg, online_provider, payment_window_minutes, feedback_score, last_online, name, trade_count, username, require_feedback_score, require_identification, require_trade_volume, require_trusted_by_advertiser, sms_verification_required, temp_price, temp_price_usd, trade_type, trusted_required, visible, volume_coefficient_btc"};
// db.version(1).stores(dbSchema);
let baseUrl = "https://localbitcoins.com/sell-bitcoins-online/VES/.json";
window.pages = [];
window.data = [];
window.currencyFilter="";

document.getElementById('btn').addEventListener('click', getInfo);

document.getElementById('myselect').addEventListener('change', function(){
  // console.log(document.getElementById('myselect').value);
  window.currencyFilter = document.getElementById('myselect').value;
  document.getElementById('btn').disabled=false;

})
document.addEventListener('DOMContentLoaded',function(){
  // console.log('Begin')
  // document.getElementById('myselect').disabled=false;
  document.querySelectorAll("tbody td").forEach(function(e){e.remove()})
  window.indexedDB.deleteDatabase("localbitcoins"); // Delete DataBase indexedDB

  // document.getElementById('btn').disabled=true;

  var tbl = document.createElement("table");
  tbl.setAttribute('id', 'criptousers');
  var tblBody = document.createElement("tbody");

  window.db = new Dexie('localbitcoins');
  // db.version(1).stores({datos: "ad_id,atm_model,bank_name,city,countrycode,created_at,currency,first_time_limit_btc," +
  // + ",hidden_by_opening_hours,is_local_office,is_low_risk,lat,limit_to_fiat_amounts,location_string,lon,max_amount," +
  // + "max_amount_available,min_amount,msg,online_provider,payment_window_minutes,feedback_score,last_online,name,trade_count, " +
  // + "username,require_feedback_score,require_identification,require_trade_volume,require_trusted_by_advertiser, " +
  // + "sms_verification_required,temp_price,temp_price_usd,trade_type,trusted_required,visible,volume_coefficient_btc"});

  // var dbSchema = {datos:"ad_id, atm_model, bank_name, city, countrycode, created_at, currency, first_time_limit_btc, hidden_by_opening_hours, is_local_office, is_low_risk, lat, limit_to_fiat_amounts, location_string, lon, max_amount, max_amount_available, min_amount, msg, online_provider, payment_window_minutes, feedback_score, last_online, name, trade_count, username, require_feedback_score, require_identification, require_trade_volume, require_trusted_by_advertiser, sms_verification_required, temp_price, temp_price_usd, trade_type, trusted_required, visible, volume_coefficient_btc"};

  var dbSchema = {datos:"ad_id"};
  db.version(1).stores(dbSchema);
  db.open().catch(function (e) {
    console.log("Open failed: " + e);
});
})


async function getInfo(){
  document.querySelectorAll("tbody td").forEach(function(e){e.remove()})
  // window.indexedDB.deleteDatabase("localbitcoins");
  window.currencyFilter = document.getElementById('myselect').value;
  document.getElementById('btn').disabled=true;
  // let currencyFilter = 'VES';
  var currentPageUrl = `https://localbitcoins.com/sell-bitcoins-online/${window.currencyFilter}/.json?page=`;
  let nextPage ='';
  var doLoop = true;
  window.pages.push(currentPageUrl);
  window.count = 1;
  window.lastPage = 10;
  // Doing a while lopp to know how many pages are
    while (doLoop) {
      await fetch(currentPageUrl + window.count)
        .then(resp => resp.json())
        .then((resp) =>{
          if(resp.pagination.next && window.count <= window.lastPage){
            window.count++
            console.log(currentPageUrl, 'curPageUrl');
            console.log(resp.pagination.next,'res.pag.next');
            // put the DATA
            for(let i=0; i< resp.data.ad_count;i++){
              window.data.push(resp.data.ad_list[i].data);
              console.log('Incluyendo data en la Bd');
              db.datos.add(resp.data.ad_list[i].data);
            }

            window.pages.push(resp.pagination.next);
            // console.log('add pages');
          	// currentPageUrl = resp.pagination.next;
          }else{
            // console.log('Exit while loop');
          	doLoop = false;
            window.lastPage = window.count + 10;
          }
        })
    }
    // let request = db.add(data);

    console.log('Finally');
    console.log(data);
    console.log(pages);
    Paginator(data,data.ad_count, 20); /// DATA, TOTAL DATA, PER PAGE
    console.log(Paginator(data).data);
    // makeTable(data);
    makeTable(Paginator(data).data);
}



/// Make a table
function makeTable(arr){
  const tBody = document.querySelector('tbody');
  console.log('makeTable');

  for(let i = 0; i< arr.length; i++){
    var row = document.createElement('tr');
    let title = ['ad_id', 'bank_name', 'city', 'currency', 'location_string', 'max_amount', 'min_amount', 'max_amount_available', 'msg', 'profile.username', 'profile.feedback_score', 'temp_price', 'temp_price_usd', 'trade_type']
    title.forEach(function(element){
      var td = document.createElement('td');

      switch (element) {
        case 'profile.username':
            let elementPr = 'profile';
            let newElementUs = 'username';
            td.innerText = arr[i][elementPr][newElementUs];
            row.append(td);
          break;
        case 'profile.feedback_score':
          let elementPr1 = 'profile';
          let newElementFd = "feedback_score";
          td.innerText = arr[i][elementPr1][newElementFd];
          // console.log(arr[i][elementPr1][newElementFd]);
          row.append(td);
          break;
        default:
          td.innerText = arr[i][element];
          row.append(td);
      }

    });

    // var td = document.createElement('td');
    //   td.innerText = arr[i].ad_id;
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = arr[i].bank_name;
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = arr[i].city;
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = arr[i].currency;
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = arr[i].location_string;
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = numeral(arr[i].max_amount).format('0,0.0000');
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = numeral(arr[i].min_amount).format('0,0.0000');
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = numeral(arr[i].max_amount_available).format('0,0.0000');
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = arr[i].msg;
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = arr[i].profile.username;
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = arr[i].profile.feedback_score;
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = numeral(arr[i].temp_price).format('0,0.0000');
    //   row.append(td);
    //
    // var td = document.createElement('td');
    //   td.innerText = numeral(arr[i].temp_price_usd).format('0,0.0000');
    //   row.append(td);
    //
    // var td = document.createElement('td');
    // td.innerText = arr[i].trade_type;
    // row.append(td);

    tBody.append(row);
    // tBody.append(row);
    // for(const key in arr[i]){
    //   var td = document.createElement('td');
    //   td.innerText = arr[i][key];
    //   row.append(td);
    // }
  }
  // tBody.append(row);
}

///FUENTE https://arjunphp.com/can-paginate-array-objects-javascript/
function Paginator(items, page, per_page) {
  // let obj ={};
  var page = page || 1,
  per_page = per_page || 10,
  offset = (page - 1) * per_page,

  paginatedItems = items.slice(offset).slice(0, per_page),
  total_pages = Math.ceil(items.length / per_page);
  return  {
  page: page,
  per_page: per_page,
  pre_page: page - 1 ? page - 1 : null,
  next_page: (total_pages > page) ? page + 1 : null,
  total: items.length,
  total_pages: total_pages,
  data: paginatedItems
  };
}

// function getInfo(){
// fetch('https://localbitcoins.com/sell-bitcoins-online/VES/.json')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(data) {
//     // return data;
//     for(let i=0; i< data.data.ad_count;i++){
//       arr.push(data.data.ad_list[i].data);
//     }
//     // arr.push(data);
//   });
//   console.log(arr);
// }
///// prueba
// function getInfo(){
// fetch('https://localbitcoins.com/sell-bitcoins-online/VES/.json')
// .then(response => response.json())
// .then(data => {
//   console.log(data) // Prints result from `response.json()` in getRequest
// })
// .catch(error => console.error(error))
// }
/////// prueba 2

// async function getInfo()
// {
//   let data = await fetch('https://localbitcoins.com/sell-bitcoins-online/VES/.json');
//   let main = await data.json();
//   console.log(main);
// }

// testing await/async function

// document.addEventListener('DOMContentLoaded',async function(){
//   let currencyFilter = 'VES';
//   var currentPageUrl = `https://localbitcoins.com/sell-bitcoins-online/${currencyFilter}/.json?page=1`;
//   var doLoop = true;
//   window.results = [];
//   window.pages = [];
//   while(doLoop){
//   	await fetch(currentPageUrl).then(res => res.json()).then((res) => {
//   	if(res.pagination.next){
//       console.log('in if')
//       console.log(currentPageUrl, 'curPageUrl')
//       console.log(res.pagination.next,'res.pag.next')
//   	window.results.push(res);
//     window.pages.push(res.pagination.next);
//   	currentPageUrl = res.pagination.next;
//   }else{
//     console.log('Exit while loop');
//   	doLoop = false;
//   	window.results.push(res);
//   }
//   })
//   }
// })




///////TESTING///////
// function getInfo(event){
//   // console.log(baseUrl);
//   fetch(baseUrl)
//   // .then(response => response.json())
//   .then(function(response){
//     // console.log(response);
//     return (response.json());
//     .then(data => console.log(data))
//   })
//   .catch(err => console.log(err));
//
// }
// function fetchInfo(){
//   debugger;
//   fetch(baseUrl)
//   .then(response => response.json())
//   .then(data => {
//     for(let i = 0; i < data.data.ad_count; i++){
//       // pag.page = data.pagination.next;
//       arr.push(data.data.ad_list[i].data);
//     }
//     pag.push(data.pagination.next);
//     return arr;
//   })
// }
///////finally////
// function getInfo(event){
// //   debugger;
//   // let baseUrl = "https://localbitcoins.com/sell-bitcoins-online/VES/.json";
//   // let arr = [];
//   // let pag = {};
//
//   let status = true;
//   while (status) {
//     if(pag.page == undefined){
//       status = false;
//     }
//     fetchInfo(pag);
//   }

  // if(baseUrl !== undefined){
  //   fetchJ(baseUrl);
  // }
  // while (status) {
      // fetch(baseUrl)
      // .then(response => response.json())
      // .then(data => {
      //   // let nextPage = data.pagination.next;
      //   for(let i = 0; i < data.data.ad_count;i++){
      //     pag.page = data.pagination.next;
      //     arr.push(data.data.ad_list[i].data);
      //   }
      //   // return nextPage;
      // })
      // console.log(pag);
      // console.log(arr);
      // let nextPage = data.pagination.next;
      // if(nextPage == undefined){
      //   status = false;
      // }else{
      //   baseUrl = nextPage;
      // }
  // }
  // fetch(baseUrl)
  // .then(response => response.json())
  // .then(data => {
  //   console.log(JSON.stringify(data.pagination.next))
  //   // let queryString = location.search;
  //   let params = (new URL('https://localbitcoins.com/sell-bitcoins-online/VES/.json?page=12')).searchParams;
  //   let page = parseInt(params.get('page'));
  //   console.log(typeof page);
  //
  // })

  // while (baseUrl !== undefined) {
  //   // fetchJ(baseUrl);
  //   fetch(baseUrl)
  //   .then(response => response.json())
  //   .then(data => {
  //     let nextPage = data.pagination.next;
  //     console.log(data.pagination.next);
  //     for(let i = 0; i < data.data.ad_count;i++){
  //       arr.push(data.data.ad_list[i].data);
  //     }
  //   })
  //   console.log(arr);
  //   debugger;
  //   baseUrl = nextPage;
  //   // return baseUrl;
  // }
  // console.log(`Este es el final:${arr}`);
  //   function fetchJ(baseUrl){
  //   fetch(baseUrl)
  //   .then(response => response.json())
  //   .then(data => {
  //     let nextPage = data.pagination.next;
  //     console.log(data.pagination.next);
  //     for(let i = 0; i < data.data.ad_count;i++){
  //       arr.push(data.data.ad_list[i].data);
  //     }
  //   })
  //   console.log(arr);
  //   debugger;
  //   baseUrl = nextPage;
  //   return baseUrl;
  // }




  // fetch(baseUrl)
  // .then(response => response.json())
  // .then(data => {
  //     let nextPage = data.pagination.next;
  //     console.log(data.pagination.next);
  //     for(let i = 0; i < data.data.ad_count;i++){
  //       arr.push(data.data.ad_list[i].data);
  //     }
  //     console.log(arr);
  //   })
  // .then(data => {
  //   let arr = [];
  //   for(let i = 0; i < data.data.ad_count; i++){
  //     console.log(data.data.ad_list[i]);
  //     arr.push(data.data.ad_list[i])
  //   }
  //   console.log(arr);
  // })
  // .catch(err => console.log(err));
// }
// console.log(pag);
// console.log(pag.page);
// console.log(arr);


//2.//
// function getInfo(event){
//   fetch(baseUrl)
//     .then(function(response){
//       if(!response.ok){
//         throw Error(response.statusText)
//       }
//       // return JSON.stringify(response);
//       console.log(response.json());
//     })
//     .then(function(responseAsJson){
//       console.log(responseAsJson);
//     })
//     .catch(function(error){
//       console.log('el problema esta aqui: \n', error);
//     })
  // }
//3
// function getInfo(event){
//   // console.log(event);
//   fetch(baseUrl, {
//     method: 'POST',
//     credentials: 'same-origin',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(baseUrl)
//   })
//   .then((resp) => resp.json())
//   .then(function(response){
//     console.info('fetch()', response);
//     return response;
//   })
// }
//4.
// function getInfo(event){
//   try {
//     const response = fetch(baseUrl);
//     if(!response.ok){
//       throw new Error(response.statusText);
//     }
//     return response.json();
//   } catch (error) {
//      console.warn(error);
//      throw error;
//   }
// }

////////////////////

// function getInfo(event){
//   console.log('aqui');
// }

// function getInfo(event){
//   fetch(`${baseUrl}`)
//   .then(function(response) {
//     // return response.json();
//     console.log(response.json());
//   })
//   .then(function(myJson) {
//     console.log(JSON.stringify(myJson));
//   });
//
// }
// function getInfo(event){
//   fetch(`${baseUrl}`, {
//     method: "GET",
//     mode: "no-cors",
//   })
//   .then(res => res.json())
//   // .then(response)
//   .then(data => console.log(data))
//   // .then(data => console.log(JSON.stringify(data)))
// }

// function getInfo(event){
//   fetch(baseUrl)
//   .then(async res => {
//     console.log(await JSON.stringify(res))
//     console.log(res)
//     console.log(res.json())
//     console.log(res.body)
//     res.json()
//   })
//   .then(data => console.log(data))
//   .catch(err => console.log(err))
//   // .then(data => console.log(JSON.stringify(data)))
// }
