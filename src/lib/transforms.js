/**
 * Extracts plain-text paragraphs from a Prismic Rich Text field.
 * Prismic returns rich text as an array of block objects like:
 *   [{ type: 'paragraph', text: '...', spans: [] }, ...]
 */
function extractParagraphs(richText) {
  if (!richText || !Array.isArray(richText)) return []
  return richText
    .filter(block => block.type === 'paragraph' && block.text)
    .map(block => block.text)
}

/**
 * Transforms a Prismic case_study document into the shape
 * that all existing components already expect.
 */
export function transformCaseStudy(doc) {
  const d = doc.data

  return {
    slug: doc.uid,
    company: d.company ?? '',
    year: d.year ?? '',
    discipline: d.discipline ?? '',
    heroGradient: d.hero_gradient ?? 'linear-gradient(160deg, #0D1B2A 0%, #0A2A3A 50%, #0A1F2E 100%)',
    headline: (d.headline_lines ?? []).map(l => l.line).filter(Boolean),
    headlineItalicWord: d.headline_italic_word ?? '',
    stats: (d.stats ?? []).map(s => ({
      label: s.stat_label ?? '',
      value: s.stat_value ?? '',
    })),
    chapters: (d.chapters ?? []).map(c => ({
      number: c.chapter_number ?? '',
      label: c.chapter_label ?? '',
      heading: c.heading ?? '',
      paragraphs: extractParagraphs(c.paragraphs),
      pullQuote: c.pull_quote || null,
      visualPanel: c.visual_panel || null,
    })),
    metrics: (d.metrics ?? []).map(m => ({
      display: m.display ?? '',
      label: m.metric_label ?? '',
    })),
    learned: d.learned ?? '',
    impact: (d.impact ?? []).map(i => i.item).filter(Boolean),
    nextProject: d.next_project_uid ?? null,
    // Manifesto card fields
    manifestoOrder: parseInt(d.manifesto_order ?? '99', 10),
    manifestoId: d.manifesto_order ?? '01',
    manifestoTitle: d.manifesto_title ?? '',
    manifestoTagline: d.manifesto_tagline ?? '',
    manifestoTags: (d.manifesto_tags ?? []).map(t => t.tag).filter(Boolean),
    manifestoColor: d.manifesto_color ?? '#3D5A80',
    manifestoHasLink: d.manifesto_has_link ?? true,
    href: `/work/${doc.uid}`,
  }
}

/**
 * Transforms a Prismic article document.
 */
export function transformArticle(doc) {
  const d = doc.data

  return {
    slug: doc.uid,
    num: d.num ?? '01',
    tag: d.tag ?? '',
    title: d.title ?? '',
    excerpt: d.excerpt ?? '',
    readTime: d.read_time ?? '',
    date: d.date ?? '',
    sections: (d.sections ?? []).map(s => ({
      heading: s.heading || null,
      paragraphs: extractParagraphs(s.paragraphs),
      pullQuote: s.pull_quote || null,
    })),
  }
}

/**
 * Transforms a Prismic shelf_product document.
 */
export function transformShelfProduct(doc) {
  const d = doc.data

  return {
    uid: doc.uid,
    num: d.num ?? '01',
    name: d.name ?? '',
    tagline: d.tagline ?? '',
    description: d.description ?? '',
    included: (d.included ?? []).map(i => i.item).filter(Boolean),
    forWho: d.for_who ?? '',
    price: d.price ?? '',
    meta: d.meta ?? '',
    cta: d.cta ?? 'Get It',
    faq: (d.faq ?? []).map(f => ({ q: f.question ?? '', a: f.answer ?? '' })),
    cardBg: d.card_bg ?? 'linear-gradient(135deg, #0D1B2A 0%, #0A2A3A 100%)',
    accentColor: d.accent_color ?? '#056B73',
  }
}

/**
 * Transforms a Prismic settings document (single type).
 */
export function transformSettings(doc) {
  const d = doc.data

  return {
    philosophyQuote: d.philosophy_quote ?? "Design is not what something looks like. It's what decision it protects you from making.",
    galleryItems: (d.gallery_items ?? []).map(item => ({
      src: item.image?.url ?? '',
      bg: item.bg_color ?? '#1E2A3D',
    })),
    about: {
      headline: d.about_headline ?? 'From Jaipur, with a sketchbook.',
      subtitle: d.about_subtitle ?? '5+ years. 3 countries. 100M+ users.\nOne consistent habit: noticing when things feel off.',
      originQuote: d.about_origin_quote ?? '',
      originParagraphs: extractParagraphs(d.about_origin_paragraphs),
      whatIDo: (d.about_what_i_do ?? []).map(i => i.item).filter(Boolean),
      miniatureText: d.about_miniature_text ?? '',
      miniatureUrl: d.about_miniature_url ?? 'https://theminiature.co',
    },
  }
}
