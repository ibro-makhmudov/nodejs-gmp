const exec = require('child_process').exec;
const fs = require('fs');

let cmd = "";
switch (process.platform) {
    case 'win32' :
        cmd = `wmic process where "PercentProcessorTime > 0" get Name,PercentProcessorTime | sort "PercentProcessorTime" /R`;
        break;

    case 'darwin' :
        cmd = "ps -A -o %cpu,comm | sort -nr | head -n 1";
        break;

    default :
        cmd = "ps -A --sort=-%cpu -o %cpu,comm | head -n 1";
}

const logStream = fs.createWriteStream('activityMonitor.log', {flags: 'a'});

setInterval(() => {
    exec(cmd, (error, stdout) => {
        if (error) {
            console.log(`Error: ${error}`);
            return;
        }
        process.stdout.clearLine();
        process.stdout.write('\x1Bc');
        process.stdout.cursorTo(0);
        process.stdout.write('Current top CLI utility program is: ' + stdout);

        //write log every minute
        let timestamp = new Date();
        if(timestamp.getSeconds() === 0){
            logStream.write(`${Date.now()} : ${stdout}`);
        }
    });
}, 100);