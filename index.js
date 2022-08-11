const MINIMUM_DELAY = 1000

const areParametersValid = (args) => {
  if (args.length != 4) {
    console.log('Se debe llamar con los parametros... `<protocol:server:port/<status endpoint> <reintentos>`')
    return false
  }
  return true
}

const context = (serverUrl, times) => {
  let currentRetry = 0;
  let currentDelay = MINIMUM_DELAY;

  const connect = (url) => new Promise((resolve, reject) => {
    fetch(url).then(res => res.json().then(json => {
      json.DB == 'OK' && json.PUCO == 'OK' ? resolve('ok') : reject()
    })).catch(reject)
  })

  const retryUntilWorksOrNoMorePendingRetries = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      connect(serverUrl).then(resolve).catch(() => {
        console.log(`Intentando con un delay de ${currentDelay}`)
        currentRetry++;
        currentDelay = currentRetry == 0 ? currentDelay : currentDelay * 2;
        (times - currentRetry) > 0 ? retryUntilWorksOrNoMorePendingRetries().then(resolve).catch(reject) : reject()
      })
    }, currentDelay)
  })

  return {
    start: retryUntilWorksOrNoMorePendingRetries
  }
}

!areParametersValid(process.argv) && process.exit(1)

const app = context(process.argv[2], process.argv[3])
app.start().then(() => {
  console.log('Conectado')
  process.exit(0)
}).catch(() => {
  console.log('No me pude conectar')
  process.exit(1)
})




