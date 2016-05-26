function getConfig() {
    return {
        title: 'Problem Solving List',
        description: 'List of problems to solve',
        site_url: 'https://dipu-bd.github.io/problem-solving-list',
        site_image: 'assets/long-list.jpg',
        authors: [
            {
                name: 'Sudipto Chandra Das',
                email: 'dipu.sudipta@gmail.com'
            }
        ]
    };
}

var parseQueryString = function (str) {
    var objURL = {};
    str.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) {
            objURL[$1] = $3;
        }
    );
    return objURL;
};

var checkValid = function (prob) {
    if (!isValidURL(prob.link)) {
        alert("Please provide valid problem link.");
        return false;
    }
    if (!prob.category || prob.category.length < 2) {
        alert("Please provide a valid category name");
        return false;
    }
    return true;
};

var isValidURL = function (str) {
    return (str);
};

var formatProblem = function (problem) {
    var parser = document.createElement('a');
    parser.href = problem.link;

    var paths = parser.pathname.split('/');
    var query = parseQueryString(parser.search);
    switch (parser.hostname) {
        case "uva.onlinejudge.org":
            problem.name = "UVA problem " + query.problem;
            break;
        case "lightoj.com":
            problem.name = "LightOJ problem " + query.problem;
            break;
        case "codeforces.com":
            problem.name = "CodeForces " + paths.join(" ").trim();
            break;
        case "acm.hust.edu.cn":
            //http://acm.hust.edu.cn/vjudge/problem/viewProblem.action?id=23915
            problem.name = "HUST VJudge problem " + query.id;
            break;
        case "acm.hdu.edu.cn":
            //http://acm.hdu.edu.cn/showproblem.php?pid=1608
            problem.name = "HDU problem " + query.pid;
            break;
        case "icpcarchive.ecs.baylor.edu":
            //https://icpcarchive.ecs.baylor.edu/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=5192
            problem.name = "ICPC Archive problem " + query.problem;
            break;
        case "www.codechef.com": //https://www.codechef.com/problems/AMLPALIN
            probem.name = "CodeChef " + paths[2];
            break;
        case "www.spoj.com": //http://www.spoj.com/problems/DISUBSTR/en/
            probem.name = "SPOJ " + paths[2];
            break;
        case "acm.timus.ru" : //http://acm.timus.ru/problem.aspx?space=1&num=1837
            problem.name = "Timus " + query.num;
            break;
        case "judge.u-aizu.ac.jp":
            //http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=0019
            problem.name = "Aizu " + query.id;
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
};
