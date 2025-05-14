
  let selectedIllustration = "";
  window.onload = function () {
  reloadSavedTable();

  // ✅ ผูก keydown เมื่อ DOM โหลดเสร็จ
  document.getElementById("thickness").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculate();
      setTimeout(() => {
        saveData();
      }, 100);
    }
  });

  document.getElementById("manualL").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calcManualD();
      setTimeout(() => {
        saveManualData();
      }, 100);
    }
  });
};




  function selectIllustration(ill) {
  selectedIllustration = ill;

  // แสดงภาพหลัก
  document.getElementById("illustrationImage").src = ill + ".png";
  document.getElementById("illustrationImage").style.display = "block";

  

  

  calculate();
}


  function getL(t) {
    if (!selectedIllustration) return "-";
    switch (selectedIllustration) {
      case "ILL-01":
        if (t < 3.2) return "Not specified";
        if (t < 4.5) return "2.5";
        if (t < 6) return "3";
        if (t < 8) return "4";
        return "-";
      case "ILL-02":
        if (t < 3.2) return "Not specified";
        if (t < 4.5) return "2.5";
        if (t < 6) return "3";
        if (t < 8) return "4";
        if (t < 9) return "6";
        if (t < 12) return "7";
        if (t < 14) return "9";
        if (t < 16) return "11";
        if (t < 19) return "13";
        return "-";
      case "ILL-03":
        if (t < 9) return "Not specified";
        if (t < 12) return "5";
        if (t < 14) return "7";
        if (t < 16) return "8";
        if (t < 19) return "10";
        if (t < 22) return "12";
        if (t < 25) return "14";
        return "16";
      case "ILL-04":
        if (t < 3.2) return "Not specified";
        if (t < 4.5) return "3";
        if (t < 6) return "4";
        if (t < 8) return "5";
        if (t < 9) return "6";
        if (t < 12) return "7";
        if (t < 14) return "9";
        if (t < 16) return "11";
        if (t < 19) return "13";
        return "-";
      case "ILL-05":
        if (t < 4.5) return "Not specified";
        if (t < 6) return "3";
        if (t < 9) return "4";
        if (t < 12) return "5";
        if (t < 14) return "6";
        if (t < 16) return "7";
        if (t < 19) return "8";
        if (t < 22) return "9";
        if (t < 25) return "10";
        return "11";
      case "ILL-06":
        if (t < 3.2) return "Not specified";
        if (t < 4.5) return "2.5";
        if (t < 6) return "3";
        if (t < 8) return "4";
        return "-";
      default:
        return "-";
    }
  }

  function getD(t, L) {
  if (L === "Not specified") return (t * 0.2).toFixed(2);
  if (L === "-") return "1.50";
  
  const Lval = parseFloat(L);
  if (isNaN(Lval)) return "Invalid";

  if (Lval > 8) return "1.50";
  return (Lval * 0.2).toFixed(2);
    if (selectedIllustration === "ILL-02" && Lval > 8) return "1.50";
    if (selectedIllustration === "ILL-03" && (["5", "7", "8"].includes(L) || Lval >= 8)) return Lval < 8 ? (Lval * 0.2).toFixed(2) : "1.50";
    if (selectedIllustration === "ILL-04" && (["3", "4", "5", "6", "7"].includes(L) || Lval >= 8)) return Lval < 8 ? (Lval * 0.2).toFixed(2) : "1.50";
    if (selectedIllustration === "ILL-05") return Lval < 8 ? (Lval * 0.2).toFixed(2) : "1.50";
    if (selectedIllustration === "ILL-06" && ["2.5", "3", "4"].includes(L)) return (Lval * 0.2).toFixed(2);
    return "1.50";
  }

  function calculate() {
    const t = parseFloat(document.getElementById("thickness").value);
    if (!selectedIllustration || isNaN(t)) {
      document.getElementById("tVal").textContent = "-";
      document.getElementById("lVal").textContent = "-";
      document.getElementById("dVal").textContent = "-";
      return;
    }

    const L = getL(t);
    const D = getD(t, L);

    document.getElementById("tVal").textContent = t.toFixed(2);
    document.getElementById("lVal").innerHTML = (L === "Not specified") ? `<span class="red-text">${L}</span>` : L;
    document.getElementById("dVal").innerHTML = D;
  }

  function saveData() {
  const t = parseFloat(document.getElementById("thickness").value);
  const manualL = parseFloat(document.getElementById("manualL").value);
  const manualD = document.getElementById("manualD").textContent.trim();

  const saved = JSON.parse(localStorage.getItem("savedWeldingData") || "[]");

  if (!isNaN(t)) {
    if (!selectedIllustration) {
      showMessage("กรุณาเลือกรูปภาพก่อน");
      return;
    }

    const L = getL(t);
    const D = getD(t, L);

    if (L === "-" || D === "-") {
      showMessage("ไม่สามารถคำนวณค่าได้ กรุณาเลือกภาพหรือกรอกใหม่");
      return;
    }

    saved.push({
      illustration: selectedIllustration,
      thickness: t.toFixed(2),
      l: L,
      d: D
    });
  } else if (!isNaN(manualL) && manualD !== "-") {
    if (!selectedIllustration) {
      showMessage("กรุณาเลือกรูปภาพก่อน");
      return;
    }

    saved.push({
      illustration: selectedIllustration,
      thickness: "-",
      l: manualL.toFixed(2),
      d: manualD
    });
  } else {
    showMessage("กรุณากรอกค่า Plate Thickness หรือ L อย่างใดอย่างหนึ่ง");
    return;
  }

  saveToLocalStorage(saved);
  reloadSavedTable();

  document.getElementById("thickness").value = "";
  document.getElementById("manualL").value = "";
  document.getElementById("manualD").textContent = "-";
  document.getElementById("tVal").textContent = "-";
  document.getElementById("lVal").textContent = "-";
  document.getElementById("dVal").textContent = "-";

  showMessage("บันทึกข้อมูลเรียบร้อยแล้ว", false);
}


function saveToLocalStorage(saved) {
  localStorage.setItem("savedWeldingData", JSON.stringify(saved));
}

function reloadSavedTable() {
  const saved = JSON.parse(localStorage.getItem("savedWeldingData") || "[]");
  const table = document.getElementById("savedDataTable").getElementsByTagName("tbody")[0];
  table.innerHTML = ""; // ล้างก่อน
  saved.forEach((item, index) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = index + 1;
    row.insertCell(1).textContent = item.illustration;
    row.insertCell(2).innerHTML = `<img src="${item.illustration}.png" alt="${item.illustration}" style="width: 80px; border-radius: 8px;">`;
    row.insertCell(3).textContent = item.thickness;
    row.insertCell(4).innerHTML = (item.l === "Not specified") ? `<span class="red-text">${item.l}</span>` : item.l;
    row.insertCell(5).textContent = item.d;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "ลบ";
    deleteBtn.style.backgroundColor = "#e74c3c";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "5px 10px";
    deleteBtn.style.borderRadius = "6px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.onclick = () => {
      saved.splice(index, 1);
  saveToLocalStorage(saved);
  reloadSavedTable();
    };
    row.insertCell(6).appendChild(deleteBtn);
  });
}
function downloadPDF() {
  const table = document.getElementById("savedDataTable").outerHTML;
  const newWin = window.open("", "", "width=1000,height=700");
  newWin.document.write("<html><head><title>Welding Data PDF</title></head><body>");
  newWin.document.write("<h2 style='text-align:center;'>ข้อมูลที่บันทึกไว้</h2>");
  newWin.document.write(table);
  newWin.document.write("</body></html>");
  newWin.document.close();
  newWin.print(); // ใช้ Save as PDF
}

function downloadExcel() {
  const table = document.getElementById("savedDataTable").outerHTML;
  const dataType = 'application/vnd.ms-excel';
  const blob = new Blob(['\ufeff' + table], { type: dataType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'welding_data.xls';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function manualUpdateD() {
  const t = parseFloat(document.getElementById("thickness").value);
  const L = parseFloat(document.getElementById("manualL").value);

  if (!selectedIllustration || isNaN(t) || isNaN(L)) {
    document.getElementById("manualD").textContent = "-";
    return;
  }

  let dVal = "1.50";
  if (L < 8) {
    dVal = (L * 0.2).toFixed(2);
  }

  document.getElementById("manualD").textContent = dVal;
}
function calcManualD() {
  const L = parseFloat(document.getElementById("manualL").value);
  const dOutput = document.getElementById("manualD");
  if (isNaN(L)) {
    dOutput.textContent = "-";
    return;
  }
  dOutput.textContent = L > 8 ? "1.50" : (L * 0.2).toFixed(2);
}
function saveManualData() {
  const L = parseFloat(document.getElementById("manualL").value);
  const D = L > 8 ? "1.50" : (L * 0.2).toFixed(2);

  if (!selectedIllustration || isNaN(L)) {
    alert("กรุณาเลือกรูปภาพ และกรอกค่า L ให้ถูกต้อง");
    return;
  }

  const saved = JSON.parse(localStorage.getItem("savedWeldingData") || "[]");
  saved.push({
    illustration: selectedIllustration,
    thickness: "-",
    l: L.toFixed(2),
    d: D
  });
  saveToLocalStorage(saved);
  reloadSavedTable();

  document.getElementById("manualL").value = "";
  document.getElementById("manualD").textContent = "-";
}
document.getElementById("thickness").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    calculate(); // คำนวณก่อน
    setTimeout(() => {
      saveData(); // รอให้ DOM อัปเดตค่าแล้วค่อยบันทึก
    }, 100);
  }
});

document.getElementById("manualL").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    calcManualD();
    setTimeout(() => {
      saveManualData(); // ✅ เพิ่มส่วนบันทึกลงตาราง
    }, 100);
  }
});
function confirmClearData() {
  if (confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลที่บันทึกไว้ทั้งหมด?")) {
    localStorage.removeItem("savedWeldingData");
    reloadSavedTable();
    alert("ล้างข้อมูลทั้งหมดแล้วเรียบร้อย!");
  }
}
document.getElementById("menuToggle").addEventListener("click", function () {
  const dropdown = document.getElementById("menuDropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});
function highlightSelected(ill) {
  const items = document.querySelectorAll(".illustration-list li");
  items.forEach(item => {
    item.classList.remove("selected");
    if (item.textContent.trim().startsWith(ill)) {
      item.classList.add("selected");
    }
  });
}



function selectIllustration(ill) {
  selectedIllustration = ill;

  // เปลี่ยนภาพหลัก
  document.getElementById("illustrationImage").src = ill + ".png";
  document.getElementById("illustrationImage").style.display = "block";

  // ลบคลาส selected-image และ selected ออกจากทั้งหมดก่อน
  document.querySelectorAll('.illustration-list li img').forEach(img => {
    img.classList.remove('selected-image');
  });
  document.querySelectorAll('.illustration-list li').forEach(li => {
    li.classList.remove('selected');
  });

  // เพิ่มคลาสให้ภาพที่เลือกและ li
  const selectedImg = document.querySelector(`.illustration-list li img[src="${ill}.png"]`);
  if (selectedImg) {
    selectedImg.classList.add('selected-image');
    selectedImg.parentElement.classList.add('selected'); // ✅ เพิ่มคลาสให้ <li>
  }

  calculate(); // คำนวณค่าเมื่อเลือกภาพ
}
