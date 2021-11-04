const path = require('path')
const SiTef = require('./module/node-sitef').default
const chalk = require('chalk')
const readline = require('readline')
rl = readline.createInterface(process.stdin, process.stdout)
const log = console.log
const moment = require('moment')
require('moment/locale/pt-br')

const dlls = path.resolve(__dirname, 'bin', 'CliSiTef64I.dll')
const sitef = new SiTef(dlls)

const config = {
  ip: process.env.SITEF_IP || '0.0.0.0',
  loja: process.env.SITEF_LOJA || '00000000',
  terminal: process.env.SITEF_TERMINAL || '00000000',
  reservado: process.env.SITEF_RESERVADO || '',
  parametrosAdicionais:
    process.env.SITEF_RESERVADO || '[00000000000000;00000000000000]',
}

const menu = `
1 - Configurar
2 - Verificar presença
3 - Escrever mensagem
4 - Simular função
5 - Limpar console
6 - Mostrar menu
7 - Sair
`

const now = () => chalk.green(`[${moment().format('LTS')}]`)

const configurar = async () => {
  log(chalk.green(`\n${now()} Configurando o SiTef`))
  try {
    const resposta = await sitef.configurar(config)
    log(chalk.green(`\n${now()} ${resposta}`))
  } catch (error) {
    log(chalk.red(`\n${now()} ${error}`))
  }
}

const verificarPresenca = async () => {
  log(chalk.green(`\n${now()} Verificando a presença do PinPad`))
  try {
    const resposta = await sitef.verificarPresenca()
    log(chalk.green(`\n${now()} ${resposta}`))
  } catch (error) {
    log(chalk.red(`\n${now()} ${error}`))
  }
}

const escreverMensagem = async () => {
  log(chalk.blue(`\n${now()} Qual mensagem deseja escrever (max. 30 letras):`))
  try {
    rl.on('line', async function (line) { 
      const response = await sitef.escreverMensagem(line);
      message = response === 0 ? 'Mensagem escrita com sucesso.' : 'Não foi possível escrever a mensagem.';
      console.log(`\n${now()}`, message, '\n');
    });
    rl.prompt()
  } catch (error) {
    log(chalk.red(`\n${now()} ${error}`))
  }
}

async function main() {
  let respostaConfigurar = await sitef.configurar(config)
  switch (respostaConfigurar) {
    case 0:
      log('')
      log(chalk.green('Configurado com sucesso'))

      rl.setPrompt(menu)
      rl.prompt()

      rl.on('line', function (line) {
        switch (line) {
          case '1':
            configurar()
            break
          case '2':
            verificarPresenca()
            break
          case '3':
            escreverMensagem()
            break
          default:
            log(chalk.red('Opção Invalida!!!'))
            break
        }
        rl.prompt()
      }).on('close', function () {
        log(chalk.blue('Que dia ótimo!'))
        process.exit(0)
      })
      break
    default:
      break
  }
}

main()
