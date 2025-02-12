import type { MarkdownInstance } from 'astro';

import type { IFrontmatter } from '@/types/IFrontMatter';

import { Link } from '../Link';

type IPostCardProps = {
  post: MarkdownInstance<IFrontmatter>;
};

const PostCard = (props: IPostCardProps) => {
  const { post } = props;

  const { title, description, pubDate, tags } = post.frontmatter;

  const formattedDate = new Date(pubDate).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4 border-b p-4">
      <div className="flex flex-col gap-2">
        <Link href={`${post.url}`}>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            {title}
          </h2>
        </Link>
        <p>{description}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p>{formattedDate}</p>
        <div className="flex flex-row gap-2">
          {tags &&
            tags.map((tag) => <p className="text-sm text-gray-500">{tag}</p>)}
        </div>
      </div>
    </div>
  );
};

export { PostCard };
