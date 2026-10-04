// How the details of a shared address read on the page.
//
// The app decides these in `LocalPackages/Sources/Models/Info.swift` and `InfoView.swift`;
// this is the same behaviour, kept apart from the view so it can be tested without one.

/**
 * Whether a floor is worth showing.
 *
 * The app stores -1 for "no floor" and shares the field as stored, so -1 does arrive here.
 * 0 is the ground floor, and very much a floor — a truthiness check would hide it.
 */
export const hasFloor = function (floor: number | undefined): floor is number {
  return typeof floor === 'number' && floor >= 0
}

/**
 * A `tel:` URL for a phone number as the sender typed it.
 *
 * Only the digits and a leading '+' are kept: the number travels unformatted, so it may
 * carry spaces, dots or dashes. Null when nothing dialable is left.
 */
export const telURL = function (phoneNumber: string): string | null {
  const trimmed = phoneNumber.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (!digits) {
    return null
  }
  return 'tel:' + (trimmed.startsWith('+') ? '+' : '') + digits
}

/** A run of the more-info text: plain, or a link to follow. */
export interface Segment {
  text: string
  href?: string
}

// Markdown links, `[text](url)`, which the app renders through SwiftUI's markdown, and bare
// web addresses, which people paste in without any markup.
const linkPattern = /\[([^\]\n]+)\]\(([^)\s]+)\)|https?:\/\/[^\s<>]+/g

// Offline codes are not authenticated: whoever draws the QR code chooses this text. So a
// link only becomes a link for a scheme that cannot run anything.
const safeScheme = /^(https?|mailto|tel):/i

// Punctuation that ends a sentence rather than a bare URL.
const trailingPunctuation = /[.,;:!?)\]'"]+$/

/**
 * The more-info text, split into plain runs and links.
 *
 * Only links are honoured, not the rest of markdown: they are what makes the field useful
 * to a recipient, and the rest would read fine as typed. Line breaks are left in the text
 * for the view to preserve.
 */
export const segments = function (text: string): Segment[] {
  const result: Segment[] = []
  let last = 0
  // Plain runs that end up side by side, as around a link that was refused, read as one.
  const push = function (segment: Segment) {
    const previous = result[result.length - 1]
    if (!segment.text) {
      return
    }
    if (!segment.href && previous && !previous.href) {
      previous.text += segment.text
    } else {
      result.push(segment)
    }
  }

  for (const match of text.matchAll(linkPattern)) {
    const [whole, label, target] = match
    const start = match.index
    let end = start + whole.length
    let link: Segment
    if (label !== undefined && target !== undefined) {
      link = safeScheme.test(target) ? { text: label, href: target } : { text: whole }
    } else {
      const url = whole.replace(trailingPunctuation, '')
      end = start + url.length
      link = { text: url, href: url }
    }
    push({ text: text.slice(last, start) })
    push(link)
    last = end
  }
  push({ text: text.slice(last) })
  return result
}
