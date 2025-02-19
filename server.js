const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const xlsx = require("xlsx");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Carrega os dados do arquivo Excel
const FILE_PATH = "Modelo_Profissional_Atestados_CID_Ajustado.xlsx";

function readExcel() {
    if (!fs.existsSync(FILE_PATH)) return [];
    const workbook = xlsx.readFile(FILE_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
}

// Endpoint para obter os dados
app.get("/dados", (req, res) => {
    const data = readExcel();
    res.json(data);
});

// Endpoint para adicionar novo dado
app.post("/adicionar", (req, res) => {
    let data = readExcel();
    data.push(req.body);

    const newWB = xlsx.utils.book_new();
    const newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWB, newWS, "Atestados");
    xlsx.writeFile(newWB, FILE_PATH);

    res.json({ message: "Dado adicionado com sucesso!" });
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
