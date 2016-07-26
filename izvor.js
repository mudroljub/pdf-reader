/*** VARIJABLE ***/

var zoom = 1;
var id = null;
var vrsta = null;
var platno = null;
var podloga = null;
var ovajDokument = null;
var brojStrane = 1;
var fajl_url = 'ctut.pdf';

/*** DOGAĐAJI ***/

window.addEventListener('load', function () {
  platno = $('#platno');
  platno.width = platno.parentElement.offsetWidth;
  platno.height = window.innerHeight;
  podloga = platno.getContext('2d');
  podloga.font = "bold 16px Arial";
  podloga.fillText("Dokument se učitava...", platno.width / 2 - 100, 100);
  ucitajPDF(fajl_url);
}); // on load

document.addEventListener('click', function (e) {
  var element = e.target;
  if (element.classList.contains('js-idi-nazad')) idiNazad();
  if (element.classList.contains('js-idi-napred')) idiNapred();
}); // on click

/*** FUNKCIJE ***/

function ucitajPDF(fajl_url) {
  PDFJS.disableWorker = true; // disable workers to avoid cross-origin issue
  // asinhrono downloaduje PDF kao ArrayBuffer
  PDFJS.getDocument(fajl_url).then(function (_pdfDoc) {
    ovajDokument = _pdfDoc;
    if (brojStrane > ovajDokument.numPages) brojStrane = ovajDokument.numPages;
    renderujStranu();
  });
}

function renderujStranu() {
  // koristi promise da fetchuje stranu
  ovajDokument.getPage(brojStrane).then(function (pdfStrana) {
    // prilagodjava se raspoloživoj širini
    var roditeljskaSirina = platno.parentElement.offsetWidth;
    var viewport = pdfStrana.getViewport(roditeljskaSirina / pdfStrana.getViewport(zoom).width);
    platno.height = viewport.height;
    platno.width = viewport.width;
    // renderuje PDF stranu na platno
    var renderContext = {
      canvasContext: podloga,
      viewport: viewport
    };
    pdfStrana.render(renderContext);
  });
  $('#trenutna_strana').textContent = brojStrane;
  $('#ukupno_strana').textContent = ovajDokument.numPages;
}

function idiNazad() {
  if (brojStrane <= 1) return;
  brojStrane--;
  renderujStranu(brojStrane);
}

function idiNapred() {
  if (brojStrane >= ovajDokument.numPages) return;
  brojStrane++;
  renderujStranu(brojStrane);
}

function isprazniTag() {
  $('#tag').value = "";
}


function $(selektor) {
  return document.querySelector(selektor);
}
