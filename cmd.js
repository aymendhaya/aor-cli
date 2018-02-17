var chalk = require("chalk");

function checkCmdLine() {
  var output = [];
  var response = {};
  var cl = process.argv.slice(2);

  var chkcr = cl[0] === "create";
  var chkup = cl[0] === "update";
  output.push({
    level: 1,
    status: chkcr || chkup,
    err: 'synthax error: "create" or "update" command not found...'
  });

  var chkmodulename =
    cl[1] !== undefined &&
    cl[1] !== "create" &&
    cl[1] !== "update" &&
    cl[1] !== "add";

  output.push({
    level: 2,
    status: chkmodulename,
    err: "synthax error: wrong or invalid module name..."
  });

  var chkadd = cl[2] === "add";

  output.push({
    level: 3,
    status: chkadd,
    err: 'synthax error: prefix "add" not found...'
  });

  var chkadddata =
    cl.indexOf("sources") > -1
      ? cl.slice(3, cl.indexOf("sources"))
      : cl.slice(3, cl.length);

  output.push({
    level: 4,
    status: chkadddata.length > 0 && chkadd,
    err:
      "missing data: at least one of [list, show, create, edit] should be declared"
  });

  var chksrc = cl.indexOf("sources") > 3;

  output.push({
    level: 5,
    status: chksrc,
    err: 'synthax error: prefix "sources" not found or misplaced...'
  });

  var chksrcdata =
    cl.indexOf("sources") > -1
      ? cl.slice(cl.indexOf("sources") + 1, cl.length)
      : [];

  output.push({
    level: 6,
    status: chksrcdata.length > 0 && chksrc && chkadd,
    err: "missing data: at least one source should be declared."
  });

  errorLog = output.filter(level => !level.status);

  response =
    errorLog.length > 0
      ? { status: false, message: chalk.red(errorLog[0].err), operation: cl[0], add: chkadddata, src: chksrcdata }
      : { status: true, message: "VALID COMMAND LINE STRUCTURE", operation: cl[0], add: chkadddata, src: chksrcdata };

      return response;
}

var t = checkCmdLine()
console.log(t.message);
