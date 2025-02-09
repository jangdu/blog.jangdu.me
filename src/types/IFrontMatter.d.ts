export interface IFrontmatter {
  title: string;
  description: string;
  pubDate: string;
  imgSrc: string;
  imgAlt: string;
  draft: boolean;
  tags?: string[];
}
