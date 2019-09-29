import ava, { TestInterface } from 'ava';
import { NestCrawlerService } from './crawler.service';

const test = ava as TestInterface<{ crawler: NestCrawlerService }>;

test.beforeEach(t => {
  t.context = {
    crawler: new NestCrawlerService,
  };
});

test('it can scrape one page as a object', async t => {
  interface ExampleCom {
    title: string;
    info: string;
  }

  const { crawler } = t.context;

  const actual: ExampleCom = await crawler.fetch({
    target: 'http://example.com',
    fetch: {
      title: 'h1',
      info: {
        selector: 'p > a',
        attr: 'href',
      },
    },
  });

  t.is(actual.title, 'Example Domain');
  t.is(actual.info, 'http://www.iana.org/domains/example');
});

test('it can scrape one page as a list object', async t => {
  interface WikiSite {
    url: string;
  }

  interface Wikipedia {
    sites: WikiSite[];
  }

  const { crawler } = t.context;

  const actual: Wikipedia = await crawler.fetch({
    target: 'https://www.wikipedia.org',
    fetch: {
      sites: {
        listItem: '.central-featured a.link-box',
        data: {
          url: {
            attr: 'href',
            convert: (x: string) => `https:${x}`,
          },
        },
      },
    },
  });

  t.is(actual.sites.length, 10);
  t.true(actual.sites[0].url.indexOf('https://') === 0);
});

test('it can crawl multi pages', async t => {
  interface HackerNewsPage {
    title: string;
  }

  const { crawler } = t.context;

  const pages: HackerNewsPage[] = await crawler.fetch({
    target: {
      url: 'https://news.ycombinator.com',
      iterator: {
        selector: 'span.age > a',
        convert: (x: string) => `https://news.ycombinator.com/${x}`,
      },
    },
    fetch: () => ({
      title: '.title > a',
    }),
  });

  t.is(pages.length, 30);
  t.true(pages[0].title !== '');
});

test('it can crawl multi pages (waitable)', async t => {
  interface HackerNewsPage {
    title: string;
  }

  const { crawler } = t.context;

  const pages: HackerNewsPage[] = await crawler.fetch({
    target: {
      url: 'https://news.ycombinator.com',
      iterator: {
        selector: 'span.age > a',
        convert: (x: string) => `https://news.ycombinator.com/${x}`,
      },
    },
    waitFor: 1 * 1000,
    fetch: () => ({
      title: '.title > a',
    }),
  });

  t.is(pages.length, 30);
  t.true(pages[0].title !== '');
});
