const ROWS = 24;
const COLS = 36;

/* ========================= */
/* DATA */
/* ========================= */

let gridData = {};
let paletteData = {};

let deletedBackup = null;

let selectedCells = [];
let firstCell = null;

let draggedItem = null;

let structureNames = {
  black:"",
  red:""
};

/* ========================= */
/* ELEMENTS */
/* ========================= */

const grid = document.getElementById("grid");
const palette = document.getElementById("palette");
const totalsBody = document.getElementById("totalsBody");

const mainView = document.getElementById("mainView");
const totalsView = document.getElementById("totalsView");

const btnTotals = document.getElementById("btnTotals");
const btnBack = document.getElementById("btnBack");

/* ========================= */
/* EDITAR UBICACIÓN */
/* ========================= */

const editModal =
  document.getElementById("editModal");

const editMarca =
  document.getElementById("editMarca");

const editAnada =
  document.getElementById("editAnada");

const editCapacidad =
  document.getElementById("editCapacidad");

const editEstado =
  document.getElementById("editEstado");

const editTipoPalet =
  document.getElementById("editTipoPalet");

const editOferta =
  document.getElementById("editOferta");

const editOfertaBox =
  document.getElementById("editOfertaBox");

const editUnidades =
  document.getElementById("editUnidades");

const editPalets =
  document.getElementById("editPalets");

const btnSaveEdit =
  document.getElementById("btnSaveEdit");

const btnCancelEdit =
  document.getElementById("btnCancelEdit");

let editingCell = null;

/* ========================= */
/* COLORS */
/* ========================= */

const colorGroups = {
  blue:["#0B3C5D","#145DA0","#1E81B0","#2E86C1","#5DADE2","#85C1E9","#AED6F1"],
  red:["#641E16","#922B21","#C0392B","#CD6155","#D98880","#E6B0AA","#F5C6CB"],
  black:["#000","#111","#222","#333","#444"],
  gray:["#666","#888","#AAA","#CCC"],
  yellow:["#B7950B","#D4AC0D","#F4D03F","#F9E79F"],
  purple:["#4A235A","#6C3483","#8E44AD","#BB8FCE","#D2B4DE"],
  orange:["#CA6F1E","#F5B041"],
  green:["#196F3D","#58D68D"],
  pink:["#912a5c"]
};

/* ========================= */
/* CREATE PALETTE */
/* ========================= */

function createPalette(){

  let index = 0;

  Object.entries(colorGroups).forEach(([group, colors])=>{

    const groupBox =
  document.createElement("div");

groupBox.className =
  `groupBox ${group}Group`;

palette.appendChild(groupBox);

    colors.forEach(color=>{

      const id = `p_${index++}`;

if(!paletteData[id]){

  paletteData[id] = {
    color,
    marca:"Platón",
    anada:"",
    unidades:0,
    estado:"Etiquetado",
    palets:0,
    capacidad:"0.75",
    oferta:"",
    tipoPalet:"Europeo",

  };

}

      const row = document.createElement("div");
      row.className = "paletteRow";

      const square = document.createElement("div");
      square.className = "colorSquare";
      square.style.background = color;

      square.draggable = true;

      square.addEventListener("dragstart", ()=>{

        draggedItem = {
          type:"stock",
          id
        };

      });

      const inputs = document.createElement("div");
      inputs.className = "paletteInputs";

      inputs.innerHTML = `

<select data-field="marca">
  <option ${paletteData[id].marca==="Platón"?"selected":""}>Platón</option>
  <option ${paletteData[id].marca==="Abracadabra"?"selected":""}>Abracadabra</option>
  <option ${paletteData[id].marca==="Madremia"?"selected":""}>Madremia</option>
  <option ${paletteData[id].marca==="24 Mozas"?"selected":""}>24 Mozas</option>
  <option ${paletteData[id].marca==="Loquillo Tinto"?"selected":""}>Loquillo Tinto</option>
  <option ${paletteData[id].marca==="Loquillo Verdejo"?"selected":""}>Loquillo Verdejo</option>
  <option ${paletteData[id].marca==="El Principito"?"selected":""}>El Principito</option>
  <option ${paletteData[id].marca==="Encomienda"?"selected":""}>Encomienda</option>
  <option ${paletteData[id].marca==="Ofertas"?"selected":""}>Ofertas</option>
</select>

<input
  type="number"
  placeholder="Añada"
  data-field="anada"
  value="${paletteData[id].anada}"
>

<input
  type="number"
  placeholder="Unidades"
  data-field="unidades"
  value="${paletteData[id].unidades}"
>

<input
  type="number"
  placeholder="Palets"
  data-field="palets"
  value="${paletteData[id].palets}"
>

<select data-field="capacidad">
  <option value="1.5"
    ${paletteData[id].capacidad=="1.5"?"selected":""}>
    1.5L
  </option>

  <option value="0.75"
    ${paletteData[id].capacidad=="0.75"?"selected":""}>
    0.75L
  </option>

  <option value="0.5"
    ${paletteData[id].capacidad=="0.5"?"selected":""}>
    0.5L
  </option>

  </select>

  <select data-field="tipoPalet">

  <option value="Europeo"
    ${paletteData[id].tipoPalet==="Europeo"?"selected":""}>
    Europeo
  </option>

  <option value="Americano"
    ${paletteData[id].tipoPalet==="Americano"?"selected":""}>
    Americano
  </option>

</select>

<select data-field="estado">

  <option value="Etiquetado"
    ${paletteData[id].estado==="Etiquetado"?"selected":""}>
    Etiquetado
  </option>

  <option value="Sin Etiquetar"
    ${paletteData[id].estado==="Sin Etiquetar"?"selected":""}>
    Sin Etiquetar
  </option>

</select>

 ${color === "#912a5c" ? `

<select data-field="oferta">

  <option value="">
    Ofertas
  </option>

  <option value="6+6">
    6+6
  </option>

  <option value="4+4+4">
    4+4+4
  </option>

  <option value="3+3+3+3">
    3+3+3+3
  </option>

  <option value="2+2+2">
    2+2+2
  </option>

  <option value="maletin mixto">
    Maletín Mixto
  </option>

  <option value="estuche mixto">
    Estuche Mixto
  </option>

</select>

` : ""}
`;

      inputs.querySelectorAll("input, select")
      .forEach(el=>{

        el.addEventListener("input", ()=>{

          paletteData[id][el.dataset.field] =
            el.value;

          updateTotals();
          saveData();

        });

      });

      row.appendChild(square);
      row.appendChild(inputs);

     groupBox.appendChild(row);

    });

  });

}

/* ========================= */
/* CREATE GRID */
/* ========================= */

function createGrid(){

  for(let r=0;r<ROWS;r++){

    for(let c=0;c<COLS;c++){

      const cell = document.createElement("div");

      cell.className = "cell";

      /* SELECT */

      cell.addEventListener("click", ()=>{

        handleSelection(r,c);

      });

      cell.addEventListener("dblclick", ()=>{

  const key = `${r}-${c}`;

  const data = gridData[key];

  if(!data) return;

  if(data.type !== "stock") return;

  editingCell = data;

  editMarca.value =
    data.marca;

  editAnada.value =
    data.anada;

  editCapacidad.value =
    data.capacidad;

  editEstado.value =
    data.estado || "Etiquetado";

  editTipoPalet.value =
    data.tipoPalet || "Europeo";

  editOferta.value =
    data.oferta || "";

  editUnidades.value =
    data.overrideUnits ?? data.unidades;

  editPalets.value =
    data.overridePalets ?? data.palets;

  if(editMarca.value === "Ofertas"){

    editOfertaBox.style.display = "block";

  }else{

    editOfertaBox.style.display = "none";

  }

  editModal.classList.remove("hidden");

});

      /* DRAG */

      cell.addEventListener("dragover", e=>{

        e.preventDefault();

      });

      cell.addEventListener("drop", e=>{

        e.preventDefault();

        applyDragged(r,c);

      });

      grid.appendChild(cell);

    }

  }

}

/* ========================= */
/* EDITAR UBICACIÓN */
/* ========================= */

editMarca.addEventListener("change", ()=>{

  if(editMarca.value === "Ofertas"){

    editOfertaBox.style.display = "block";

  }else{

    editOfertaBox.style.display = "none";

    editOferta.value = "";

  }

});

btnCancelEdit.addEventListener("click", ()=>{

  editModal.classList.add("hidden");

});

btnSaveEdit.addEventListener("click", ()=>{

  if(!editingCell) return;

  editingCell.marca =
    editMarca.value;

  editingCell.anada =
    editAnada.value;

  editingCell.capacidad =
    Number(editCapacidad.value);

  editingCell.estado =
    editEstado.value;

  editingCell.tipoPalet =
    editTipoPalet.value;

  editingCell.oferta =
    editOferta.value;

  editingCell.overrideUnits =
    Number(editUnidades.value);

  editingCell.overridePalets =
    Number(editPalets.value);

  editModal.classList.add("hidden");

  renderGrid();

  updateTotals();

  saveData();

});

/* ========================= */
/* SELECTION */
/* ========================= */

function handleSelection(r,c){

  if(!firstCell){

    clearSelection();

    firstCell = {r,c};

    selectCell(r,c);

    return;

  }

  clearSelection();

  const r1 = Math.min(firstCell.r,r);
  const r2 = Math.max(firstCell.r,r);

  const c1 = Math.min(firstCell.c,c);
  const c2 = Math.max(firstCell.c,c);

  for(let i=r1;i<=r2;i++){

    for(let j=c1;j<=c2;j++){

      selectCell(i,j);

    }

  }

  firstCell = null;

}

function selectCell(r,c){

  const cell = getCell(r,c);

  cell.classList.add("selected");

  selectedCells.push({r,c});

}

function clearSelection(){

  selectedCells = [];

  document.querySelectorAll(".selected")
  .forEach(el=>el.classList.remove("selected"));

}

/* ========================= */
/* APPLY */
/* ========================= */

function applyDragged(r,c){

  const targets =
    selectedCells.length
    ? selectedCells
    : [{r,c}];

  targets.forEach(pos=>{

    const key = `${pos.r}-${pos.c}`;

    /* STRUCTURE */

    if(draggedItem.type === "structure"){

  const isBlack =
    draggedItem.border === "black";

  const minR =
    Math.min(...targets.map(t=>t.r));

  const maxR =
    Math.max(...targets.map(t=>t.r));

  const minC =
    Math.min(...targets.map(t=>t.c));

  const maxC =
    Math.max(...targets.map(t=>t.c));

  const centerCell =
    pos.r === minR &&
    pos.c === minC;

  gridData[key] = {

    type:"structure",

    border:draggedItem.border,

    text:draggedItem.text,

    short:
      isBlack
        ? (centerCell
            ? draggedItem.text
            : "")
        : draggedItem.text,

    merged:isBlack,

    top:
      pos.r === minR,

    bottom:
      pos.r === maxR,

    left:
      pos.c === minC,

    right:
      pos.c === maxC

  };

}

    /* STOCK */

    else{

      const p = paletteData[draggedItem.id];

      gridData[key] = {
        type:"stock",
        paletteId:draggedItem.id,
        color:p.color,
        marca:p.marca,
        anada:p.anada,
        unidades:Number(p.unidades),
        palets:Number(p.palets),
        capacidad:Number(p.capacidad),
        tipoPalet:p.tipoPalet,
        estado:p.estado,
        oferta:p.oferta
      };

    }

  });

  renderGrid();
  updateTotals();
  saveData();

}

/* ========================= */
/* STRUCTURE INPUTS */
/* ========================= */

document.querySelectorAll(".structureInput")
.forEach(input=>{

  input.addEventListener("input", ()=>{

    const type =
      input.dataset.structureInput;

    structureNames[type] =
      input.value;

    saveData();

  });

});

/* ========================= */
/* STRUCTURES */
/* ========================= */

document.querySelectorAll(".structureSquare")
.forEach(square=>{

  square.addEventListener("dragstart", ()=>{

    const border =
      square.dataset.structure;

    const input =
      document.querySelector(
        `[data-structure-input="${border}"]`
      );

    draggedItem = {
      type:"structure",
      border,
      text:input.value || "X"
    };

  });

});

/* ========================= */
/* RENDER */
/* ========================= */

function renderGrid(){

  for(let r=0;r<ROWS;r++){

    for(let c=0;c<COLS;c++){

      const cell = getCell(r,c);

      const data =
        gridData[`${r}-${c}`];

      cell.className = "cell";

      cell.textContent = "";

      cell.style.background = "white";

      cell.style.borderTop = "";
cell.style.borderBottom = "";
cell.style.borderLeft = "";
cell.style.borderRight = "";

      if(!data) continue;

      /* STOCK */

      if(data.type === "stock"){

        cell.style.background = data.color;

        const rgb =
  hexToRgb(data.color);

const brightness =
  (rgb.r * 299 +
   rgb.g * 587 +
   rgb.b * 114) / 1000;

cell.style.color =
  brightness < 140
    ? "white"
    : "black";

        cell.textContent =
          data.overrideUnits ||
          data.unidades;

      }

      /* STRUCTURE */

      else{

        if(data.border === "black"){

          cell.classList.add("structureBlack");

if(data.top){

  cell.style.borderTop =
    "2px solid black";

}else{

  cell.style.borderTop =
    "none";

}

if(data.bottom){

  cell.style.borderBottom =
    "2px solid black";

}else{

  cell.style.borderBottom =
    "none";

}

if(data.left){

  cell.style.borderLeft =
    "2px solid black";

}else{

  cell.style.borderLeft =
    "none";

}

if(data.right){

  cell.style.borderRight =
    "2px solid black";

}else{

  cell.style.borderRight =
    "none";

}

        }else{

          cell.classList.add("structureRed");

        }

        cell.textContent = data.short;

      }

    }

  }

}

/* ========================= */
/* TOTALS */
/* ========================= */

function updateTotals(){

  const totals = {};

  let grandUnits = 0;
  let grandPalets = 0;
  let grandLiters = 0;

  Object.values(gridData)
  .forEach(item=>{

    if(item.type !== "stock") return;

    /* ========================= */
/* OFERTAS */
/* ========================= */

if(item.oferta){

  const units =
    item.overrideUnits ||
    item.unidades;

  const offers = {

    "6+6":[
      ["24 Mozas",6],
      ["Madremia",6]
    ],

    "4+4+4":[
      ["Abracadabra",4],
      ["Madremia",4],
      ["24 Mozas",4]
    ],

    "3+3+3+3":[
      ["Abracadabra",3],
      ["Madremia",3],
      ["24 Mozas",3],
      ["Loquillo Tinto",3]
    ],

    "2+2+2":[
      ["Abracadabra",2],
      ["Madremia",2],
      ["24 Mozas",2]
    ],

    "maletin mixto":[
      ["Abracadabra",2],
      ["Madremia",2],
      ["24 Mozas",2]
    ],

    "estuche mixto":[
      ["Abracadabra",1],
      ["Madremia",1],
      ["24 Mozas",1]
    ]

  };

  const totalParts =
    offers[item.oferta]
    .reduce((a,b)=>a+b[1],0);

  offers[item.oferta]
  .forEach(([marca,mult])=>{

    const key = [
      marca,
      item.anada,
      item.capacidad,
      item.estado
    ].join("|");

    if(!totals[key]){

      totals[key] = {

        marca,
        anada:item.anada,
        capacidad:item.capacidad,
        estado:item.estado,
        unidades:0,
        palets:0,
        litros:0

      };

    }

    const totalUnits =
      (
        Number(units) /
        totalParts
      ) * mult;

    totals[key].unidades +=
      totalUnits;

    totals[key].palets +=
      Number(item.palets || 0);

    totals[key].litros +=
      totalUnits *
      Number(item.capacidad);

    grandUnits += totalUnits;

    grandPalets +=
      Number(item.palets || 0);

    grandLiters +=
      totalUnits *
      Number(item.capacidad);

  });

  return;

}

    const units =
      item.overrideUnits ||
      item.unidades;

    const key = [
      item.marca,
      item.anada,
      item.capacidad,
      item.estado
    ].join("|");

    if(!totals[key]){

      totals[key] = {
        marca:item.marca,
        anada:item.anada,
        capacidad:item.capacidad,
        estado:item.estado,
        unidades:0,
        palets:0,
        litros:0
      };

    }

    totals[key].unidades += Number(units);

    const palets =
  item.overridePalets ??
  item.palets ??
  0;

totals[key].palets +=
  Number(palets);

    totals[key].litros +=
      Number(units) *
      Number(item.capacidad);

    /* GRAND TOTALS */

    grandUnits += Number(units);

    grandPalets +=
  Number(palets);

    grandLiters +=
      Number(units) *
      Number(item.capacidad);

  });

totalsBody.innerHTML = "";

/* ORDEN DE MARCAS */

const brandOrder = [

  "Platón",

  "Abracadabra",

  "Madremia",

  "24 Mozas",

  "Loquillo Tinto",

  "Encomienda",

  "El Principito",

  "Loquillo Verdejo"

];

/* ORDENAR */

const sortedTotals = Object.values(totals).sort((a,b)=>{

  const brandDiff =

    brandOrder.indexOf(a.marca)

    -

    brandOrder.indexOf(b.marca);

  /* SI LA MARCA ES DISTINTA */

  if(brandDiff !== 0){

    return brandDiff;

  }

  /* SI LA MARCA ES IGUAL */

  return Number(a.anada)

    -

    Number(b.anada);

});

/* PINTAR TABLA */

sortedTotals.forEach(t=>{

  const tr = document.createElement("tr");

  tr.innerHTML = `

    <td>${t.marca}</td>

    <td>${t.anada}</td>

    <td>${t.capacidad}</td>

    <td>${t.unidades}</td>

    <td>${t.estado}</td>

    <td>${t.palets}</td>

    <td>${t.litros.toFixed(1)}</td>

  `;

  totalsBody.appendChild(tr);

});

  /* ========================= */
  /* TOTAL GENERAL */
  /* ========================= */

  const totalRow =
    document.createElement("tr");

  totalRow.innerHTML = `
    <td colspan="3">
      <strong>TOTAL GENERAL</strong>
    </td>

    <td>
      <strong>${grandUnits}</strong>
    </td>

    <td></td>

    <td>
      <strong>${grandPalets}</strong>
    </td>

    <td>
      <strong>${grandLiters.toFixed(1)}</strong>
    </td>
  `;

  totalsBody.appendChild(totalRow);

}

/* ========================= */
/* UTIL */
/* ========================= */

function getCell(r,c){

  return grid.children[
    r * COLS + c
  ];

}

/* ========================= */
/* BUTTONS */
/* ========================= */

/* DELETE */

document.getElementById("btnDelete")
.addEventListener("click", ()=>{

  deletedBackup =
    JSON.parse(JSON.stringify(gridData));

  selectedCells.forEach(pos=>{

    delete gridData[
      `${pos.r}-${pos.c}`
    ];

  });

  clearSelection();

  renderGrid();
  updateTotals();
  saveData();

});

/* CLEAR */

document.getElementById("btnClear")
.addEventListener("click", ()=>{

  deletedBackup =
    JSON.parse(JSON.stringify(gridData));

  gridData = {};

  clearSelection();

  renderGrid();
  updateTotals();
  saveData();

});

document.getElementById("btnUndo")
.addEventListener("click", ()=>{

  if(!deletedBackup){

    alert("No hay ningún borrado para recuperar.");

    return;

  }

  gridData =
    JSON.parse(JSON.stringify(deletedBackup));

  deletedBackup = null;

  renderGrid();

  updateTotals();

  saveData();

});

/* TOTALS */

btnTotals.addEventListener("click", ()=>{

  updateTotals();
  saveData();

  mainView.classList.add("hidden");

  totalsView.classList.remove("hidden");

  btnTotals.classList.add("hidden");

  btnBack.classList.remove("hidden");

});

/* BACK */

btnBack.addEventListener("click", ()=>{

  totalsView.classList.add("hidden");

  mainView.classList.remove("hidden");

  btnBack.classList.add("hidden");

  btnTotals.classList.remove("hidden");

});

/* PDF */

document.getElementById("btnPdf")
.addEventListener("click", async ()=>{

  /* ========================= */
  /* EXPORTAR TOTALES */
  /* ========================= */

  if(!totalsView.classList.contains("hidden")){

    window.print();

    return;
  }

  /* ========================= */
  /* EXPORTAR PLANO */
  /* ========================= */

  const { jsPDF } = window.jspdf;

  const pdf =
    new jsPDF("portrait","mm","a4");

  const panel =
    document.getElementById("panel");

  const gridWrapper =
    document.getElementById("gridWrapper");

  /* GUARDAR ESTILOS */

  const oldPanelOverflow =
    panel.style.overflow;

  const oldGridOverflow =
    gridWrapper.style.overflow;

  const oldPanelHeight =
    panel.style.height;

  const oldGridHeight =
    gridWrapper.style.height;

  /* EXPANDIR CONTENIDO */

  panel.style.overflow = "visible";
  gridWrapper.style.overflow = "visible";

  panel.style.height = "auto";
  gridWrapper.style.height = "auto";

  /* ========================= */
/* HOJA 1 -> PALETA */
/* ========================= */

pdf.setFontSize(10);

pdf.text(
  "PALETA DE STOCK",
  10,
  10
);

let y = 20;

Object.entries(paletteData)
.forEach(([id,p],index)=>{

  /* NUEVA PAGINA */

  if(y > 280){

    pdf.addPage("a4","portrait");

    y = 7;

  }

  /* COLOR */

  const rgb =
    hexToRgb(p.color);

  pdf.setFillColor(
    rgb.r,
    rgb.g,
    rgb.b
  );

  pdf.rect(
    10,
    y - 5,
    8,
    8,
    "F"
  );

  /* TEXTO */

  pdf.setTextColor(0,0,0);

  pdf.setFontSize(7);

  pdf.text(
    `Marca: ${p.marca}`,
    20,
    y
  );

  pdf.text(
    `Añada: ${p.anada || "-"}`,
    50,
    y
  );

  pdf.text(
    `Unidades: ${p.unidades}`,
    75,
    y
  );

  pdf.text(
  `Estado: ${p.estado || "Etiquetado"}`,
  100,
  y
);

  pdf.text(
  `Palets: ${p.palets}`,
  130,
  y
);
pdf.text(
  `Tipo Palets: ${p.tipoPalet || "-"}`,
  145,
  y
);

  pdf.text(
    `Capacidad: ${p.capacidad}L`,
    180,
    y
  );

  y += 7;

  if(p.oferta){

  pdf.text(
    `Ofertas: ${p.oferta}`,
    125,
    y
  );

}

});

/* ========================= */
/* NUEVA PAGINA GRID */
/* ========================= */

pdf.addPage("a4","landscape");

  const gridCanvas =
    await html2canvas(grid,{
      scale:2,
      useCORS:true
    });

  const gridImg =
    gridCanvas.toDataURL("image/png");

  pdf.addImage(
    gridImg,
    "PNG",
    5,
    5,
    287,
    190
  );

  /* RESTAURAR */

  panel.style.overflow =
    oldPanelOverflow;

  gridWrapper.style.overflow =
    oldGridOverflow;

  panel.style.height =
    oldPanelHeight;

  gridWrapper.style.height =
    oldGridHeight;

  /* DESCARGAR */

  pdf.save("almacen.pdf");

});

/* ========================= */
/* INIT */
/* ========================= */

loadData();

createPalette();
createGrid();

/* RESTORE STRUCTURE INPUTS */

document.querySelector(
  '[data-structure-input="black"]'
).value = structureNames.black || "";

document.querySelector(
  '[data-structure-input="red"]'
).value = structureNames.red || "";

renderGrid();
updateTotals();

function hexToRgb(hex){

  hex = hex.replace("#","");

  if(hex.length === 3){

    hex =
      hex.split("")
      .map(x=>x+x)
      .join("");

  }

  const bigint =
    parseInt(hex,16);

  return {
    r:(bigint >> 16) & 255,
    g:(bigint >> 8) & 255,
    b:bigint & 255
  };

}
/* ========================= */
/* SAVE */
/* ========================= */

function saveData(){

  localStorage.setItem(
    "warehouse_grid",
    JSON.stringify(gridData)
  );

  localStorage.setItem(
    "warehouse_palette",
    JSON.stringify(paletteData)
  );

  localStorage.setItem(
  "warehouse_structures",
  JSON.stringify(structureNames)
);

}

/* ========================= */
/* LOAD */
/* ========================= */

function loadData(){

  const savedGrid =
    localStorage.getItem(
      "warehouse_grid"
    );

  const savedPalette =
    localStorage.getItem(
      "warehouse_palette"
    );

  if(savedGrid){

    gridData =
      JSON.parse(savedGrid);

  }

  Object.values(gridData).forEach(item=>{

  if(item.type === "stock" && item.estado === undefined){

    item.estado = "Etiquetado";

  }

});

  if(savedPalette){

    paletteData =
      JSON.parse(savedPalette);

  }

  Object.values(paletteData).forEach(item=>{

  if(item.estado === undefined){

    item.estado = "Etiquetado";

  }

});

  const savedStructures =
  localStorage.getItem(
    "warehouse_structures"
  );

if(savedStructures){

  structureNames =
    JSON.parse(savedStructures);

}
saveData();

}

/* ========================= */
/* EXPORT JSON */
/* ========================= */

document.getElementById("btnExport")
.addEventListener("click", ()=>{

  const data = {

    gridData,
    paletteData,
    structureNames

  };

  const json =
    JSON.stringify(data,null,2);

  const blob =
    new Blob(
      [json],
      {
        type:"application/json"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    "almacen_bodega.json";

  a.click();

  URL.revokeObjectURL(url);

});

/* ========================= */
/* IMPORT JSON */
/* ========================= */

document.getElementById("btnImport")
.addEventListener("click", ()=>{

  document.getElementById("importFile")
    .click();

});

document.getElementById("importFile")
.addEventListener("change", e=>{

  const file =
    e.target.files[0];

  if(!file) return;

  const reader =
    new FileReader();

  reader.onload = event=>{

    try{

      const data =
        JSON.parse(
          event.target.result
        );

      gridData =
        data.gridData || {};

      paletteData =
        data.paletteData || {};

      structureNames =
        data.structureNames || {
          black:"",
          red:""
        };

      /* RESTORE INPUTS */

      document.querySelector(
        '[data-structure-input="black"]'
      ).value =
        structureNames.black || "";

      document.querySelector(
        '[data-structure-input="red"]'
      ).value =
        structureNames.red || "";

      /* REBUILD */

      palette.innerHTML = "";

      createPalette();

      renderGrid();

      updateTotals();

      saveData();

      alert("Importación completada");

    }catch(err){

      alert("Archivo JSON inválido");

    }

  };

  reader.readAsText(file);

});