const youtubedl = require('youtube-dl-exec');
const fs = require("fs");
const Twit = require("twit");

const response = require("./response");

async function downloader(link, thumbnail, tweet) {
    console.log(`Recieved link`, link)

    const subprocess = youtubedl.exec(link.trim(), { dumpSingleJson: true })

    var output_path = 'components/cache/output.json';
    var error_path = 'components/cache/error.txt';
    
    subprocess.stdout.pipe(fs.createWriteStream(output_path), null, 4);
    subprocess.stderr.pipe(fs.createWriteStream(error_path), null, 4);

    subprocess.stdout.on('end', async function () {
        var stream = fs.createReadStream(output_path, {flags: 'r', encoding: 'utf-8'});
        var buf = '';
        
        stream.on('data', async function(d) {
            buf += d.toString();
            var result = await pump();

            return result;
        });

        async function pump() {
            var pos;
        
            while ((pos = buf.indexOf('\n')) >= 0) {
                if (pos == 0) {
                    buf = buf.slice(1);
                    continue;
                }
                var final_link = await processLine(buf.slice(0,pos));
                buf = buf.slice(pos+1);
            }

            return final_link;
        };

        async function processLine(line) {

            if (line[line.length-1] == '\r') line=line.substr(0,line.length-1);

            if (line.length > 0) {
                var obj = JSON.parse(line);

                var formats = obj.formats;
                const filtered_formats = formatFilter(formats);

                response(filtered_formats, thumbnail, tweet);
            };
        };
    })
};

function formatFilter(formats) {

    var filtered_list = [];

    formats.forEach(format => {
        var protocol = format.protocol;

        if(protocol == "https") {
            filtered_list.push(format)
        }
        else {
            console.log(`Ignoring format: ${protocol}`);
        }
    });

    console.log(`Formats after filter length: ${filtered_list.length}`);
    return filtered_list;
};

module.exports = downloader