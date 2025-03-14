import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className:
      "text-xl font-medium decoration-dashed hover:underline hover:opacity-70",
  };

  return (
    <li className="border-skin-muted my-8 flex flex-col gap-2 border-b pb-8">
      <a
        href={href}
        className="inline-block w-fit text-xl font-medium decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} size="sm" />
      <p className="text-sm opacity-80">{description}</p>
    </li>
  );
}
