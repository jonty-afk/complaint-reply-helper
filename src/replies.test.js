import test from 'node:test'
import assert from 'node:assert/strict'
import { buildReply, fillName, wordCount, TONES, SCENARIOS, RESOLUTIONS } from './replies.js'

const base = { customer: 'Sam', order: '1234', item: 'milk', agent: 'Rishabh', note: '', tone: 'warm', scenario: 'missing', resolution: 'refund' }

test('uses customer name, order and item', () => {
  const r = buildReply(base)
  assert.match(r, /^Hi Sam,/)
  assert.match(r, /milk was missing from your order 1234/)
  assert.match(r, /refund for milk/)
  assert.match(r, /Rishabh$/)
})

test('falls back when fields are blank', () => {
  const r = buildReply({ ...base, customer: ' ', order: '', item: '', agent: '' })
  assert.match(r, /^Hi there,/)
  assert.match(r, /an item was missing from your order\./)
  assert.match(r, /\[Your name\]$/)
})

test('tone changes greeting and sign-off', () => {
  const r = buildReply({ ...base, tone: 'formal' })
  assert.match(r, /^Dear Sam,/)
  assert.match(r, /Yours sincerely,/)
})

test('brief tone is shorter than warm', () => {
  assert.ok(wordCount(buildReply({ ...base, tone: 'brief' })) < wordCount(buildReply(base)))
})

test('extra note is included once', () => {
  const r = buildReply({ ...base, note: 'I have also flagged this with the store.' })
  assert.equal(r.split('flagged this with the store').length - 1, 1)
})

test('every combination builds without error', () => {
  for (const tone of Object.keys(TONES))
    for (const scenario of Object.keys(SCENARIOS))
      for (const resolution of Object.keys(RESOLUTIONS)) {
        const r = buildReply({ ...base, tone, scenario, resolution })
        assert.ok(r.length > 50)
        assert.ok(!r.includes('undefined'))
      }
})

test('unknown option throws', () => {
  assert.throws(() => buildReply({ ...base, tone: 'nope' }))
})

test('fillName and wordCount', () => {
  assert.equal(fillName(undefined), 'there')
  assert.equal(wordCount('  '), 0)
  assert.equal(wordCount('a b  c'), 3)
})
