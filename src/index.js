String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};


const axios = require('axios');
const readline = require('readline');

const url = "https://www.linkcorreios.com.br/";

const rastramento = (codigo = 'PU378066229BR') => {

    let path = `${url}${codigo}`;
    console.log(`URL: ${path}\n`)
    axios.get(path).then((resp)=>{
       processPage(resp.data);
    })
    .catch(err => {
        console.error(err);
    })
}

const processPage = (page) => {
    let table = getTable(page)
    let trs = getTrs(table)
    let linhas = getTds(trs);

    printInfo(linhas);
}

const printInfo = (linhas = [])=>{

    for (let index = 0; index < linhas.length; index++) {
        const element = linhas[index];
        const next = linhas[index + 1] || ""

        console.log(`${element} | ${next}`)
        index += 1
    }
}

const getTds = (trs) => {

    linhas = []
    saida = []
    for(tr of trs){
        let aux = tr.replaceAll('\n', '').replaceAll('\t', '').replaceAll('<td>', '').replaceAll('</td>', '')
        linhas.push(aux)
    }

    for(linha of linhas){
        if (linha.indexOf("Objeto") > -1 ){
            let initData = linha.indexOf("rowspan=") + 12
            let endData = linha.indexOf("<td c")
            let initType = linha.indexOf("<strong>") + 8
            let endType = linha.indexOf("</strong>")

            saida.push(`${linha.substring(initData, endData)} - ${linha.substring(initType, endType)}`)
        }else if (linha.indexOf("Origem") > -1){
            let initOrigem = linha.indexOf("<tr>") + 4
            let endOrigem = linha.indexOf("Destino")
            
            let initDestino = linha.indexOf("Destino")
            let endDestino = linha.lenght

            saida.push(`${linha.substring(initOrigem, endOrigem)} - ${linha.substring(initDestino, endDestino)}`)

        }else if(linha.indexOf("Local") > -1){
           
            let initDestino = linha.indexOf("Local:")
            let endDestino = linha.lenght

            saida.push(`${linha.substring(initDestino, endDestino)}`)

        }
    }
    return saida;
}


const getTrs = (table) => {
    let aux = table.replace('<tbody>', '')
    return aux.split('</tr>')
    
}

const getTable=(page)=>{
    let pInit = page.indexOf('<tbody>')
    let pStop = page.indexOf('</tbody>')

    return page.substring(pInit, pStop)
}

const leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

leitor.question("Qual o código de rastreio? ", function(answer) {
    var resp = answer == "" ? undefined : answer.replace('\n', '');
    rastramento(resp);
    
    leitor.close();
});