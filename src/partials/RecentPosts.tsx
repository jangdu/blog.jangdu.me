import type { MarkdownInstance } from 'astro';
import { GradientText, Section } from 'astro-boilerplate-components';

import type { IFrontmatter } from '@/types/IFrontMatter';

import { PostCard } from './posts/PostCard';

type IRecentPostsProps = {
  postList: MarkdownInstance<IFrontmatter>[];
};

const RecentPosts = (props: IRecentPostsProps) => {
  return (
    <Section
      title={
        <div className="flex items-baseline justify-between">
          <div>
            <GradientText>Posts</GradientText>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 md:grid-cols-2 lg:grid-cols-3">
        {props.postList.map((post) => (
          <PostCard key={post.url} post={post} />
        ))}
      </div>
    </Section>
  );
};

export { RecentPosts };
