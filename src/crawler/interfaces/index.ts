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
  fetch: ScrapeOptions;
}

interface ScraperConfig {
  target: string;
  fetch: ScrapeOptions;
}

export {
  CrawlerConfig,
  ScraperConfig,
  ScrapeOptions,
  ScrapeOptionLinks,
  ScrapeOptionElement,
  ScrapeOptionList,
  ScrapeResult,
}
