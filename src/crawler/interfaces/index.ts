import {
  ScrapeOptions,
  ScrapeOptionElement,
  ScrapeOptionList,
  ScrapeResult,
} from 'scrape-it';

interface ScrapeOptionLinks {
  url: string;
  iterator: string | {
    selector: string;
    convert?: (link: string) => string;
  };
}

interface CrawlerConfig {
  target: string[] | ScrapeOptionLinks;
  each: ScrapeOptions;
}

export {
  CrawlerConfig,
  ScrapeOptions,
  ScrapeOptionLinks,
  ScrapeOptionElement,
  ScrapeOptionList,
  ScrapeResult,
}
