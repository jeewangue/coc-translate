import got, { Got } from 'got';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { isEmpty } from 'lodash-es';
import { SocksProxyAgent } from 'socks-proxy-agent';
import url from 'url';
import { Config } from './config';

const ProxyAgentMap = {
  'http:': HttpProxyAgent,
  'https:': HttpsProxyAgent,
  'socks:': SocksProxyAgent,
};

function isProxyAgentProtocal(protocol: string): protocol is keyof typeof ProxyAgentMap {
  return protocol in ProxyAgentMap;
}

export const getProxyAgent = (proxy: string): HttpProxyAgent | HttpsProxyAgent | SocksProxyAgent | undefined => {
  if (isEmpty(proxy)) {
    return;
  }
  proxy = proxy.replace('localhost', '127.0.0.1');
  const protocol = url.parse(proxy).protocol;
  if (protocol && isProxyAgentProtocal(protocol)) {
    const agent = new ProxyAgentMap[protocol](proxy);
    return agent;
  }
  throw new Error(`Not supported protocol: ${proxy}`);
};

export const getGotInstance = (cfg: Config): Got => {
  const agent = getProxyAgent(cfg.proxy);
  return got.extend({
    timeout: {
      request: cfg.timeout,
    },
    agent: {
      http: agent,
      https: agent,
    },
  });
};
