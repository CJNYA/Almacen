const ROWS = 24;
const COLS = 36;

/* ========================= */
/* DATA */
/* ========================= */

let gridData = {};
let paletteData = {};

let selectedCells = [];
let firstCell = null;

let draggedItem = null;

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

    colors.forEach(color=>{

      const id = `p_${index++}`;

if(!paletteData[id]){

  paletteData[id] = {
    color,
    marca:"Platón",
    anada:"",
    unidades:0,
    palets:0,
    capacidad:"0.75"
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

      palette.appendChild(row);

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

      /* DOUBLE CLICK */

      cell.addEventListener("dblclick", ()=>{

        const key = `${r}-${c}`;

        const data = gridData[key];

        if(!data) return;

        if(data.type !== "stock") return;

        const value = prompt(
          "Editar unidades",
          data.overrideUnits || data.unidades
        );

        if(value !== null){

          data.overrideUnits = Number(value);

          renderGrid();
          updateTotals();
          saveData();

        }

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

      gridData[key] = {
        type:"structure",
        border:draggedItem.border,
        text:draggedItem.text,
        short:
          draggedItem.text
          .charAt(0)
          .toUpperCase()
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
        capacidad:Number(p.capacidad)
      };

    }

  });

  renderGrid();
  updateTotals();
  saveData();

}

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

    const units =
      item.overrideUnits ||
      item.unidades;

    const key = [
      item.marca,
      item.anada,
      item.capacidad
    ].join("|");

    if(!totals[key]){

      totals[key] = {
        marca:item.marca,
        anada:item.anada,
        capacidad:item.capacidad,
        unidades:0,
        palets:0,
        litros:0
      };

    }

    totals[key].unidades += Number(units);

    totals[key].palets +=
      Number(item.palets || 0);

    totals[key].litros +=
      Number(units) *
      Number(item.capacidad);

    /* GRAND TOTALS */

    grandUnits += Number(units);

    grandPalets +=
      Number(item.palets || 0);

    grandLiters +=
      Number(units) *
      Number(item.capacidad);

  });

  totalsBody.innerHTML = "";

  Object.values(totals)
  .forEach(t=>{

    const tr =
      document.createElement("tr");

    tr.innerHTML = `
      <td>${t.marca}</td>
      <td>${t.anada}</td>
      <td>${t.capacidad}</td>
      <td>${t.unidades}</td>
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

  gridData = {};

  clearSelection();

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

pdf.setFontSize(16);

pdf.text(
  "Paleta de stock",
  10,
  10
);

let y = 20;

Object.entries(paletteData)
.forEach(([id,p],index)=>{

  /* NUEVA PAGINA */

  if(y > 180){

    pdf.addPage("a4","portrait");

    y = 20;

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

  pdf.setFontSize(10);

  pdf.text(
    `Marca: ${p.marca}`,
    25,
    y
  );

  pdf.text(
    `Añada: ${p.anada || "-"}`,
    80,
    y
  );

  pdf.text(
    `Unidades: ${p.unidades}`,
    125,
    y
  );
  pdf.text(
  `Palets: ${p.palets}`,
  125,
  y + 4
);

  pdf.text(
    `Capacidad: ${p.capacidad}L`,
    175,
    y
  );

  y += 10;

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

  if(savedPalette){

    paletteData =
      JSON.parse(savedPalette);

  }

}