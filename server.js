const express = require('express')
const sleep = require('await-sleep')
const app = express()
const port = process.env.PORT || 3000

const FASTLY_TTL = process.env.FASTLY_TTL || String(60 * 60 * 24) // 24 hours
const STALE_TTL = String(60 * 60) // 1 hour
const { FASTLY_TEST_RESPONSE_STATUS, FASTLY_TEST_RESPONSE_DELAY } = process.env

app.get('/', (req, res) => {
  res.set({
    'cache-control': 'no-store, must-revalidate',
    'surrogate-control': `max-age=${FASTLY_TTL}, stale-if-error=${STALE_TTL}, stale-while-revalidate=${STALE_TTL}`,
    'surrogate-key': 'all-the-things'
  })

  const time = (new Date()).toISOString()

  if (FASTLY_TEST_RESPONSE_STATUS) {
    res.status(Number(FASTLY_TEST_RESPONSE_STATUS)).send(`Status ${FASTLY_TEST_RESPONSE_STATUS} ${time}`)
  } else if (FASTLY_TEST_RESPONSE_DELAY) {
    await sleep(Number(FASTLY_TEST_RESPONSE_DELAY) * 1000)
    res.status(200).send(`200 Success ${time} (delayed ${FASTLY_TEST_RESPONSE_DELAY} seconds)`)
  } else {
    res.status(200).send(`200 Success ${time}`)
  }
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))