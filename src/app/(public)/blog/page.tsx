import React from 'react';
import { getPosts } from '@/lib/queries';
import { BlogIndexView } from '@/components/blog/blog-index-view';

export const metadata = {
  title: 'Technical Blog & Architecture Notes | Olehi Davis',
  description: 'Deep dives on distributed systems, concurrency guarantees, PostgreSQL optimization, and high-performance modern web architecture by Olehi Davis.',
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const posts = await getPosts(true);

  return <BlogIndexView initialPosts={posts} />;
}
