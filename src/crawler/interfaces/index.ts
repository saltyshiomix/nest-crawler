import {
  ScrapeOptions,
  ScrapeOptionElement,
  ScrapeOptionList,
  ScrapeResult,
} from 'scrape-it';

interface ScrapeOptionLinks {
  url: string;
  links: ScrapeOptionList;
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
