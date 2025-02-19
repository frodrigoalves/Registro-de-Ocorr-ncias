document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("tabela-dados");
    const btnAdicionar = document.getElementById("adicionar");

    // Carregar os dados
    async function carregarDados() {
        const response = await fetch("/dados");
        const data = await response.json();

        tabela.innerHTML = "";
        data.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.Data || "N/A"}</td>
                <td>${item.Nome || "N/A"}</td>
                <td>${item.CID || "N/A"}</td>
                <td>${item.Subcategoria || "N/A"}</td>
            `;
            tabela.appendChild(tr);
        });

        gerarGrafico(data);
    }

    // Adicionar novo registro
    btnAdicionar.addEventListener("click", async () => {
        const data = document.getElementById("data").value;
        const nome = document.getElementById("nome").value;
        const cid = document.getElementById("cid").value;
        const subcategoria = document.getElementById("subcategoria").value;

        if (!data || !nome || !cid) {
            alert("Preencha todos os campos!");
            return;
        }

        await fetch("/adicionar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Data: data, Nome: nome, CID: cid, Subcategoria: subcategoria })
        });

        carregarDados();
    });

    // Gerar gráfico
    function gerarGrafico(data) {
        const ctx = document.getElementById("grafico").getContext("2d");
        const cids = {};
        data.forEach(item => {
            if (item.CID) {
                cids[item.CID] = (cids[item.CID] || 0) + 1;
            }
        });

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(cids),
                datasets: [{
                    label: "Frequência de CIDs",
                    data: Object.values(cids),
                    backgroundColor: "blue"
                }]
            }
        });
    }

    carregarDados();
});
