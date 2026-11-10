// Reply builder: a reply is assembled from a scenario, a tone and a resolution.

export const TONES = {
  warm: {
    label: 'Warm and empathetic',
    greeting: (n) => `Hi ${n},`,
    opening: 'Thank you for getting in touch, and I am really sorry about the trouble you have had.',
    closing: 'Thank you for your patience, and again my apologies. Please reply to this email if there is anything else I can do.',
    signoff: 'Kind regards,',
  },
  formal: {
    label: 'Formal',
    greeting: (n) => `Dear ${n},`,
    opening: 'Thank you for contacting us regarding your recent experience. I apologise for the inconvenience caused.',
    closing: 'Please do not hesitate to contact us if you require further assistance.',
    signoff: 'Yours sincerely,',
  },
  brief: {
    label: 'Short and direct',
    greeting: (n) => `Hi ${n},`,
    opening: 'Sorry about this.',
    closing: 'Let me know if you need anything else.',
    signoff: 'Regards,',
  },
  firm: {
    label: 'Firm but polite',
    greeting: (n) => `Hello ${n},`,
    opening: 'Thank you for your message. I have looked into this and want to be clear about where we stand.',
    closing: 'I understand this may not be the answer you were hoping for. If you would like this reviewed further, please reply and I will pass it to a manager.',
    signoff: 'Regards,',
  },
}

export const SCENARIOS = {
  late: {
    label: 'Late or missed delivery',
    issue: (o) => `I can see that your order${o.order ? ` ${o.order}` : ''} did not arrive when it was meant to.`,
  },
  missing: {
    label: 'Missing item',
    issue: (o) => `I understand that ${o.item || 'an item'} was missing from your order${o.order ? ` ${o.order}` : ''}.`,
  },
  damaged: {
    label: 'Damaged or faulty item',
    issue: (o) => `I understand that ${o.item || 'your item'} arrived damaged or not working${o.order ? ` in order ${o.order}` : ''}.`,
  },
  substitution: {
    label: 'Unwanted substitution',
    issue: (o) => `I understand that ${o.item || 'an item'} in your order${o.order ? ` ${o.order}` : ''} was replaced with something you did not want.`,
  },
  service: {
    label: 'Poor service from staff',
    issue: () => 'I understand that the service you received did not meet the standard you should expect.',
  },
  charge: {
    label: 'Wrong charge or billing error',
    issue: (o) => `I understand there is a problem with the amount charged${o.order ? ` for order ${o.order}` : ''}.`,
  },
}

export const RESOLUTIONS = {
  refund: {
    label: 'Refund',
    line: (o) => `I have arranged a refund${o.item ? ` for ${o.item}` : ''}. It should show on your original payment method within 3 to 5 working days.`,
  },
  replace: {
    label: 'Replacement',
    line: (o) => `I am arranging a replacement${o.item ? ` of ${o.item}` : ''} and will confirm the details once it is on its way.`,
  },
  credit: {
    label: 'Store credit',
    line: () => 'I have added credit to your account, which you can use on your next order.',
  },
  investigate: {
    label: 'Investigate and follow up',
    line: () => 'I am looking into exactly what happened and will come back to you with an update within 2 working days.',
  },
  decline: {
    label: 'Unable to offer a refund',
    line: () => 'Unfortunately we are not able to offer a refund in this case, based on our returns policy.',
  },
}

export function fillName(name) {
  const n = (name || '').trim()
  return n || 'there'
}

export function buildReply(opts) {
  const tone = TONES[opts.tone]
  const scenario = SCENARIOS[opts.scenario]
  const resolution = RESOLUTIONS[opts.resolution]
  if (!tone || !scenario || !resolution) throw new Error('Unknown tone, scenario or resolution')

  const o = {
    order: (opts.order || '').trim(),
    item: (opts.item || '').trim(),
  }
  const parts = [
    tone.greeting(fillName(opts.customer)),
    // brief tone keeps the opening and issue on one line
    opts.tone === 'brief' ? `${tone.opening} ${scenario.issue(o)}` : tone.opening,
    opts.tone === 'brief' ? null : scenario.issue(o),
    resolution.line(o),
    (opts.note || '').trim() || null,
    tone.closing,
    `${tone.signoff}\n${(opts.agent || '').trim() || '[Your name]'}`,
  ].filter(Boolean)
  return parts.join('\n\n')
}

export function wordCount(text) {
  const t = text.trim()
  return t ? t.split(/\s+/).length : 0
}
