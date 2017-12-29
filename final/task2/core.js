function generate(containerID, matrix, coloring) {

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (typeof matrix !== 'undefined') {
        random = false;
    } else {
        random = true;
    }

    if (coloring) {
        exteremes = findExtremes(matrix);
    }


    var tbody = "";
    for (var i = 0; i < 3; i++) {
        tbody += '<tr>';
        for (var j = 0; j < 3; j++) {

            tbody += '<td style="td" ';
            if (coloring) {
                var currentIndices = [i, j];
                if (arraysEqual(exteremes[0], currentIndices)) {
                    tbody += 'bgcolor="#00bfff"';
                } else if (arraysEqual(exteremes[1], currentIndices))
                    tbody += 'bgcolor="#ff4500"';
            }

            tbody += '>';
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


function findExtremes(matrix) {
    var maxIndices = [0, 0];
    var minIndices = [0, 0];
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] > matrix[maxIndices[0]][maxIndices[1]])
                maxIndices = [i, j];
            else if (matrix[i][j] < matrix[minIndices[0]][minIndices[1]])
                minIndices = [i, j];
        }
    }
    return [maxIndices, minIndices]
}


function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
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
        generate("table_result", multiplyMatrices(m1, m2), true);
    } else {
        generate("table_result", sumOrSubstractMatricies(m1, m2, operation), true);
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
