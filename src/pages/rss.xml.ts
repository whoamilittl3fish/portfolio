import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';

type BlogPost = CollectionEntry<'blogs'>;

// if someone ask why function GET, the answer is astro when building, dev it will find function export GET
// and then it run this one time, return rss (from rss.astro dependency)
// this will return to request rss.xml site.

export async function GET(context: APIContext) {
  const site = context.site || 'https://zoskisk.vercel.app';
  
  // Get all blog posts
  const allPostsRaw = await getCollection('blogs');
  
  // Filter only EN posts (id ends with '/en.md')
  const enPosts = allPostsRaw.filter((post: BlogPost) => 
    post.id.endsWith('/en.md')
  );
  
  // Sort by date (newest first)
  const sortedPosts = enPosts.sort((a: BlogPost, b: BlogPost) => 
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  
  // Generate RSS items
  const items = sortedPosts.map((post: BlogPost) => {
    const slug = post.id.split('/')[0]; // Extract slug from id (e.g., 'api-overview/en.md' -> 'api-overview')
    const link = `${site}/blogs/en/${slug}`;
    
    return {
      title: post.data.title,
      description: post.data.description,
      link: link,
      pubDate: post.data.date,
      ...(post.data.image && { 
        enclosure: {
          url: new URL(post.data.image, site).toString(),
          type: 'image/png'
        }
      })
    };
  });
  
  return rss({
    title: 'Khoa Ngo Blogs',
    description: 'Blog posts about many things that I learn and explore.',
    site: site,
    items: items,
    customData: `<language>en-us</language>`,
  });
}

