const term = new Terminal({
	cursorStyle: "block",
	cursorBlink: true,
	fontSize:	 18,
	//rows:		 40,
	//cols:		 170,
	theme: {
		background:	'#4f545c',
		cursor:		'#ffffff',
		forground:	'#ff0000',
	}
});

var line 		= "";
var index		= 0;
var path		= "~";
const prompt	= `shell:${path}$ `;
var pos			= 0;

function help_panel(term)
{
	for (let cmd of callbacks)
		term.write(`${cmd[0]}\t|\t${cmd[2]}\r`);
}

function clear_console(term)
{
	term.write('\33[H\33[2J');
	document.getElementById('content').innerHTML = "";
}

function print_working_directory(term)
{
	term.write(`${path}\r\n`);
}

function fetch_subject(term)
{
	console.log(fetch('README.md', {mode: 'no-cors'}).then(obj => {
		//document.getElementById('content').innerHTML = marked.parse());
		console.log(obj.text().then(data => {
			document.getElementById('content').innerHTML = marked.parse(data);
		}));
	}));
}


var callbacks = [
				['clear', clear_console, 'clear console\n'],
				['help', help_panel, 'show help\n'],
				['pwd', print_working_directory, 'command test\n'],
				['fetch', fetch_subject, 'fetch subject\n'],
				]

function executeCommands(line)
{
	for (let cmd of callbacks)
		if (line == cmd[0]) return (cmd[1](term));
}

term.open(document.getElementById('terminal'));
term.write(prompt + ' ');

term.on('key', (key, ev) => {
	console.log(ev);
	if (ev.keyCode == 37) {
		if (!pos)
			return ;
		pos--;
	}
	if (ev.keyCode == 39)
		pos++;
	if (ev.keyCode == 38 || ev.keyCode == 40)
		return ;
	if (ev.keyCode == 13) {
		term.write("\r\n");
		executeCommands(line);
		line = "";
		term.write(prompt);
		index = 0;
		return ;
	}
	if (ev.keyCode == 8) {
		if (!line)
			return ;
		line = line.slice(0, line.length - 1);
		term.write("\b \b");
		return ;
	}
	line += key;
	term.write(key);
});

term.on('paste', (data) => {
	line += data;
	term.write(data);
});
