import React from 'react';
import { getPosts } from '@/lib/queries';
import { BlogStudioView } from '@/components/admin/blog-studio-view';

export const dynamic = 'force-dynamic';

export default async function AdminBlogStudioPage() {
  const posts = await getPosts(false);

  return <BlogStudioView initialPosts={posts} />;
}
