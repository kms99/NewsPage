const apiKey = '85b0d5af83624d83a3b8ed0c91dff13f';
let sideBar = document.getElementById("category-menu-sm");
let searchArea = document.getElementById("search-area");
let categoryMenu = document.querySelectorAll(".category-menu button");
let userInput = document.getElementById("user-input");
let searchButton = document.getElementById("search-button");
let totalResults = 0;
let totalPage = 0;
let currentPage =1;
let url="";
let articles=[];

//default page load
const callApi = ()=>{
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=general&pageSize=5`);
    getApi();
}

//api logic
const getApi = async()=>{
    url.searchParams.set('page', currentPage);
    let header = new Headers({"x-api-key" : apiKey});
    let response = await fetch(url,{headers:header});
    let data = await response.json()
    articles = await data.articles;

    console.log(response);
    console.log(data);
    console.log(articles);

    totalResults=data.totalResults;

    render();
}

//time moment 
const changeTime = (time) =>{
    let newTime =""
    newTime = time.replace("T", " ");
    newTime = newTime.slice(0,newTime.length-1);

    console.log(newTime);
    return newTime;
}

//display api data
const render = ()=>{
    let newsHtml = "";
    articles.forEach((item)=>{
        newsHtml += `<div class="row news-list">
        <div class="col-lg-4 img-div">
            <img src=${item.urlToImage||"./image/No_Image.jpg"} class="news-image">
        </div>
        <div class="col-lg-6">
            <h1 onclick="goToNews('${item.url}')" class="news-title">${item.title}</h1>
            <p>${item.description}</p>
            <p>source : ${item.author||"no source"}<p>
            <p>published :  ${moment(changeTime(item.publishedAt)).fromNow()}</p>
        </div>
    </div>`
    });
    document.getElementById("news-area").innerHTML = newsHtml;
    pagination();
}



//category change event
const changeCategory = (e)=>{
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${e.target.textContent.toLowerCase()}&pageSize=5`);
    currentPage =1;
    sideBar.style.width = 0;
    getApi();
}

//side bar event
const openSideBar=()=>sideBar.style.width = "250px";
const closeSideBar=()=>sideBar.style.width = 0;

//search area event
const openSearch= ()=>searchArea.style.display=="none"?searchArea.style.display="inline":searchArea.style.display="none";

//keyword search
const userSearchEvent = () =>{
    currentPage =1;
    searchArea.style.display="none";
    url = new URL(`https://newsapi.org/v2/everything?q=${userInput.value}&pageSize=5`);
    getApi();
}

//show pagination 
const pagination = () => {
    let paginationHtml = "";
    let lastAtGroup =0;
    let firstAtGroup =0;
    let currentPageGroup = Math.ceil(currentPage/5);
    totalPage = Math.ceil(totalResults/5);
    
    currentPageGroup*5>totalPage?firstAtGroup=(currentPageGroup-1)*5+1:firstAtGroup= currentPageGroup*5-4;

    currentPageGroup*5>totalPage ? lastAtGroup = totalPage : lastAtGroup = currentPageGroup*5;

    if(1<currentPage){
        paginationHtml+=`<a class="page-link" href="#" aria-label="Previous" onclick="changePage('first')">
        <span aria-hidden="true">&laquo;</span>
      </a>`;
        paginationHtml+=`<a class="page-link" href="#" aria-label="Previous" onclick="changePage('previous')">
        <span aria-hidden="true">&lt;</span>
      </a>`;
    }

    for(let i =firstAtGroup ; i<lastAtGroup+1 ; i++){

        if(i==currentPage){
            paginationHtml+=  `<li class="page-item active"><a class="page-link" href="#" onclick="paginationClick(${i})">${i}</a></li>`;
        }else{
            paginationHtml+=  `<li class="page-item"><a class="page-link" href="#" onclick="paginationClick(${i})">${i}</a></li>`;
        }
    }
    
    if(currentPage<totalPage){
        paginationHtml+=`<a class="page-link" href="#" aria-label="Next" onclick="changePage('next')">
        <span aria-hidden="true">&gt;</span>
      </a>`;
        paginationHtml+=`<a class="page-link" href="#" aria-label="Previous" onclick="changePage('last')">
      <span aria-hidden="true">&raquo;</span>
    </a>`;
    }

    document.querySelector(".pagination").innerHTML = paginationHtml;
}

const paginationClick = (index)=>{
    currentPage=index;
    getApi();
}

const changePage = (e) =>{
    if(e=="previous"){
        currentPage--;
    }else if(e=="next"){
        currentPage++;
    }else if(e=="first"){
        currentPage = 1;
    }else if(e=="last"){
        currentPage = totalPage;
    }
    getApi();
}


// title click event 
let goToNews = (address) => {
    window.open(address);
}

//category menu click event
categoryMenu.forEach((item)=>item.addEventListener("click",(event)=>changeCategory(event)));

//search button click event & enter event
searchButton.addEventListener("click",()=>userSearchEvent());
userInput.addEventListener("keypress",(event)=>{
    if(event.keyCode == 13){userSearchEvent()}});
callApi();

//input text 
userInput.addEventListener("focus",(event)=>event.target.value="");