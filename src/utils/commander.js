import {Command} from 'commander'

const program = new Command()

//Estoy diciendo que en la variable <mode> ira almacenada la palabra produccion
//Si no escribo --mode unValor entonces se alamacenara valor default 'Produccion'
program.option("--mode <mode>", "Modo de trabajo", "Produccion")
program.parse()

export {program}