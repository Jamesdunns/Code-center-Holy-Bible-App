let testament="old",book="Genesis",chapter=1,selected=0,playing=false;
const $=x=>document.getElementById(x);
function list(){return testament==="old"?BIBLE_DATA.oldTestament:BIBLE_DATA.newTestament}
function cur(){return list().find(x=>x.name===book)}
function ch(){return cur().chapters[chapter-1]}
function renderBooks(){let q=$("search").value.toLowerCase();$("books").innerHTML=list().filter(x=>x.name.toLowerCase().includes(q)).map(x=>`<button class="book ${x.name===book?"active":""}" onclick="selectBook('${x.name.replaceAll("'","\\'")}')"><span>${x.name}</span><small>${x.chapters.length}</small></button>`).join("")}
function selectBook(x){book=x;chapter=1;selected=0;renderAll()}
function renderChapters(){$("chapters").innerHTML=cur().chapters.map((x,i)=>`<option value="${i+1}">Chapter ${i+1}</option>`).join("");$("chapters").value=chapter}
function esc(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderReader(){let c=ch();$("title").textContent=book;$("subtitle").textContent="Chapter "+chapter;$("readerTitle").textContent=book+" "+chapter;$("testament").textContent=testament==="old"?"OLD TESTAMENT":"NEW TESTAMENT";$("verses").innerHTML=c.verses.map(v=>`<span class="verse ${selected===v.number?"selected":""}"><sup class="num" onclick="selected=${v.number};renderReader()">${v.number}</sup>${esc(v.text)}</span>`).join(" ");$("audioTitle").textContent=book+" "+chapter;$("audioStatus").textContent=c.audio?"Audio available":"Browser speech available";$("prev").disabled=chapter===1&&list().findIndex(x=>x.name===book)===0;$("next").disabled=chapter===cur().chapters.length&&list().findIndex(x=>x.name===book)===list().length-1}
function renderAll(){renderBooks();renderChapters();renderReader()}
function move(d){let a=list(),i=a.findIndex(x=>x.name===book);if(d<0){if(chapter>1)chapter--;else if(i>0){book=a[i-1].name;chapter=a[i-1].chapters.length}}else{if(chapter<cur().chapters.length)chapter++;else if(i<a.length-1){book=a[i+1].name;chapter=1}}selected=0;renderAll();scrollTo({top:0,behavior:"smooth"})}
$("prev").onclick=()=>move(-1);$("next").onclick=()=>move(1);$("chapters").onchange=e=>{chapter=+e.target.value;selected=0;renderReader()};$("search").oninput=renderBooks;
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{testament=b.dataset.t;document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");book=list()[0].name;chapter=1;selected=0;renderAll()});
const audio=$("audio");
function toggleAudio(){let c=ch();if(c.audio){if(audio.paused){audio.play().then(()=>{playing=true;ui()}).catch(()=>toast("Audio could not start"))}else audio.pause()}else{speechSynthesis.cancel();let text=c.verses.map(v=>`Verse ${v.number}. ${v.text}`).join(" ");let u=new SpeechSynthesisUtterance(book+" chapter "+chapter+". "+text);u.lang="en-US";u.rate=.9;u.onstart=()=>{playing=true;ui()};u.onend=()=>{playing=false;ui()};speechSynthesis.speak(u);playing=true;ui();toast("Browser text-to-speech started")}}
function stopAudio(){audio.pause();audio.currentTime=0;speechSynthesis.cancel();playing=false;ui()}
function ui(){$("play").textContent=playing?"❚❚":"▶";$("audioStatus").textContent=playing?"Playing":"Ready"}
audio.onended=()=>{playing=false;ui()};$("volume").oninput=e=>audio.volume=e.target.value;
function toggleSide(){$("sidebar").classList.toggle("open")}function toggleDark(){document.body.classList.toggle("dark");localStorage.bibleDark=document.body.classList.contains("dark")}
function copyChapter(){let t=book+" "+chapter+"\\n\\n"+ch().verses.map(v=>v.number+". "+v.text).join("\\n");navigator.clipboard?.writeText(t).then(()=>toast("Chapter copied"))}
function shareChapter(){if(navigator.share)navigator.share({title:book+" "+chapter,text:"Read "+book+" "+chapter+" in the Holy Bible"});else copyChapter()}
function toast(x){let t=$("toast");t.textContent=x;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
if(localStorage.bibleDark==="true")document.body.classList.add("dark");renderAll();audio.volume=.9;