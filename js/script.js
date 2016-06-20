/**
 * @file script.js
 * @desc contains function used in front-end
 */

function formatProblem(problem) {
    var parser = document.createElement('a');
    parser.href = problem.link;

    var paths = parser.pathname.split('/');
    var query = parseQueryString(parser.search);

    switch (parser.hostname) {
        case "uva.onlinejudge.org":
            problem.name = "UVA " + query.problem;
            break;
        case "lightoj.com":
            problem.name = "LightOJ " + query.problem;
            break;
        case "acm.hust.edu.cn":
            //http://acm.hust.edu.cn/vjudge/problem/viewProblem.action?id=23915
            problem.name = "HUST VJudge " + query.id;
            break;
        case "acm.hdu.edu.cn":
            //http://acm.hdu.edu.cn/showproblem.php?pid=1608
            problem.name = "HDU " + query.pid;
            break;
        case "icpcarchive.ecs.baylor.edu":
            //https://icpcarchive.ecs.baylor.edu/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=5192
            problem.name = "ICPC Archive " + query.problem;
            break;
        case "www.codechef.com": //https://www.codechef.com/problems/AMLPALIN
            problem.name = "CodeChef " + paths[2];
            break;
        case "www.spoj.com": //http://www.spoj.com/problems/DISUBSTR/en/
            problem.name = "SPOJ " + paths[2];
            break;
        case "acm.timus.ru" : //http://acm.timus.ru/problem.aspx?space=1&num=1837
            problem.name = "Timus " + query.num;
            break;
        case "judge.u-aizu.ac.jp":
            //http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=0019
            problem.name = "Aizu " + query.id;
            break;
        case "codeforces.com":
            problem.name = "CodeForces ";
            for (var i = 0; i < paths.length; ++i) {
                if ($.isNumeric(paths[i]))
                    problem.name += paths[i] + " ";
                else if (paths[i].length == 1)
                    problem.name += paths[i] + " ";
            }
            problem.name = problem.name.trim();
            break;
        default:
            // most judge has problem tag in search param
            if (query.hasOwnProperty('problem')) {
                problem.name = parser.hostname + " " + query["problem"];
            } else {
                problem.name = parser.hostname + " " +
                    path.join(" ").trim() + " " +
                    parser.search.slice(1) + " " +
                    parser.hash;
                problem.name = problem.name.trim();
            }
            break;
    }

    /*
     parser.protocol; // => "http:"
     parser.hostname; // => "example.com"
     parser.port;     // => "3000"
     parser.pathname; // => "/pathname/"
     parser.search;   // => "?search=test"
     parser.hash;     // => "#hash"
     parser.host;     // => "example.com:3000"
     */
}

// used in formatProblem()
function parseQueryString(str) {
    var objURL = {};
    str.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) {
            objURL[$1] = $3;
        }
    );
    return objURL;
}

// used to validate add problem form
function validatePROB(prob) {
    if (!isValidUrl(prob.link)) {
        alert("Please provide valid problem link.");
        return false;
    }
    if (!prob.category || prob.category.length < 2) {
        alert("Please provide a valid category name");
        return false;
    }
    return true;
}

// used to validate url

function isValidUrl(url) {
    if (!url) return false;
    var doc, base, anchor, isValid = false;
    try {
        doc = document.implementation.createHTMLDocument("");
        base = doc.createElement("base");
        base.href = base || window.lo;
        doc.head.appendChild(base);
        anchor = doc.createElement("a");
        anchor.href = url;
        doc.body.appendChild(anchor);
        isValid = !(anchor.href === "");
    } catch (e) {
        console.error(e);
    } finally {
        doc.head.removeChild(base);
        doc.body.removeChild(anchor);
        base = null;
        anchor = null;
        doc = null;
    }
    return isValid;
}