const term = new Terminal();

var line = "";
var index = 0;
var prompt = ">>>"

function help_panel(term)
{
	for (let cmd of callbacks)
		term.write(`${cmd[0]}\t|\t${cmd[2]}\r`);
}

function clear_console(term)
{
	term.write('\33[H\33[2J');
}

var callbacks = [
				['clear', clear_console, 'clear console\n'],
				['help', help_panel, 'show help\n'],
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
	if (ev.keyCode == 13) {
		term.write("\r\n");
		executeCommands(line);
		line = "";
		term.write(prompt);
		term.write(' ');
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

term.on("paste", (data) => {
	line += data;
	term.write(data);
});