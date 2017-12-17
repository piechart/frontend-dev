function generate(containerID, matrix) {

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (typeof matrix !== 'undefined') {
        random = false;
    } else {
        random = true;
    }

    var tbody = "";
    for (var i = 0; i < 3; i++) {
        tbody += '<tr>';
        for (var j = 0; j < 3; j++) {

            tbody += '<td style="td">';
            if (random) {
                var num = randomNumber(1, 10);
            } else
                num = matrix[i][j];
            tbody += ' ' + num;
            tbody += '</td>'

        }
        tbody += '</tr>\n\n';
    }
    document.getElementById(containerID).innerHTML = tbody;
}

function toMatrix(tbl) {
    var tblArr = [];
    tblLength = document.getElementById(tbl).rows.length;
    for (i = 0; i < tblLength; i++) {
        tempArr = [];
        for (j = 0; j < document.getElementById(tbl).rows[i].cells.length; j++) {
            tempArr[j] = document.getElementById(tbl).rows[i].cells[j].innerHTML;
        }
        tblArr[i] = tempArr
    }
    return tblArr;
}

function operateMatrices(m1, m2, operation) {
    if (operation == "*") {
        generate("table_result", multiplyMatrices(m1, m2));
    } else {
        generate("table_result", sumOrSubstractMatricies(m1, m2, operation));
    }
}

function multiplyMatrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function sumOrSubstractMatricies(m1, m2, operation) {
    for (var i = 0; i < m1.length; i++) {
        for (var j = 0; j < m2[0].length; j++)
            if (operation == "+")
                m1[i][j] = parseInt(m1[i][j]) + parseInt(m2[i][j]);
            else if (operation == "-")
                m1[i][j] = m1[i][j] - m2[i][j];
            else alert("Unknown operation")
    }
    return m1;
}
