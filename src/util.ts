class UrlMatcher {
  constructor() { }

  public linkMatch = (content: string): string[] => {
    const matched = content.match(/(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}([\/a-z0-9-%#?&=\w])+(\.[a-z0-9]{2,4}(\?[\/a-z0-9-%#?&=\w]+)*)*/gi);
    return matched ? matched : [];
  }

  public domainMatch = (link: string): string[] => {
    const matched = link.match(/(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi);
    return matched ? matched : [];
  }
}

export default UrlMatcher;