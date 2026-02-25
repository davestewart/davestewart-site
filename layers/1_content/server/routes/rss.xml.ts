import RSS from 'rss'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const feed = new RSS({
    title: 'Dave Stewart',
    site_url: 'https://davestewart.co.uk', // Update with actual URL
    feed_url: 'https://davestewart.co.uk/rss.xml',
  })

  // Fetch all content, sorted by date
  const docs = await serverQueryContent(event)
    .sort({ date: -1 })
    .find()

  // Filter for blog and work paths
  const posts = docs.filter(doc => doc._path?.startsWith('/blog/') || doc._path?.startsWith('/work/'))

  for (const doc of posts) {
    feed.item({
      title: doc.title || 'Untitled',
      url: `https://davestewart.co.uk${doc._path}`,
      date: doc.date,
      description: doc.description,
    })
  }

  const feedString = feed.xml({ indent: true })
  event.node.res.setHeader('content-type', 'text/xml')
  event.node.res.end(feedString)
})
