import ava, { TestInterface } from 'ava';
import { CrawlerService } from './crawler.service';

interface Context {
  crawler: CrawlerService;
}

const test = ava as TestInterface<Context>;

test.beforeEach(t => {
  t.context = {
    crawler: new CrawlerService,
  };
});

interface ExampleCom {
  title: string;
  info: string;
}

test('it can scrape one page', async t => {
  const { crawler } = t.context;

  const actual: ExampleCom = await crawler.scrape<ExampleCom>('http://example.com', {
    title: 'h1',
    info: {
      selector: 'p > a',
      attr: 'href',
    },
  });

  t.is(actual.title, 'Example Domain');
  t.is(actual.info, 'http://www.iana.org/domains/example');
});
