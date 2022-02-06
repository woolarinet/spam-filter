import UrlMatcher from './util';
import axios from 'axios';

class SpamFilter {
  content: string;
  spamLinkDomains: string[];
  redirectionDepth: number;
  private matcher: UrlMatcher;

  constructor(content: string, spamLinkDomains: string[], redirectionDepth: number) {
    this.content = content;
    this.spamLinkDomains = spamLinkDomains;
    this.redirectionDepth = redirectionDepth;
    this.matcher = new UrlMatcher();
  }

  private spamCheck = (links: string[], spamList: string[]): boolean => {
    return links.map(link => this.matcher.domainMatch(link)[0])
      .some(domain => spamList.includes(domain));
  }

  private getLinks = async (link: string): Promise<string[]> => {
    try {
      const res = await axios.get(link);
      let links: string[] = [];
      if (res) {
        if (res.status === 301 || res.status === 302) links = [res.headers.location];
        else links = this.matcher.linkMatch(res.data);
      }
      return links;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  public isSpam = async (): Promise<boolean> => {
    const links = this.matcher.linkMatch(this.content);

    let nextLinks: any[] = JSON.parse(JSON.stringify(links));
    for (let dep = 0; dep < this.redirectionDepth; dep++) {
      nextLinks = await Promise.all(
        nextLinks.map(link => this.getLinks(link))
      )
      nextLinks = nextLinks.flat();
    }
    if (!nextLinks.length) return false;

    return this.spamCheck(nextLinks, this.spamLinkDomains);
  }
}

export default SpamFilter;