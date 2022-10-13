import {
  Formality,
  ListLanguagesCommand,
  TranslateClient,
  TranslateTextCommand,
  TranslateTextCommandInput,
} from '@aws-sdk/client-translate';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { compact, includes, isUndefined, map } from 'lodash-es';
import { Config, getProxyAgent, logger } from '../common';

export class AwsTranslateManager {
  private cli: TranslateClient;
  private formality: Formality | undefined;
  private langCodes: string[];
  /*
   * source language code
   */
  private sl: string;
  /*
   * target language code
   */
  private tl: string;

  private constructor() {
    this.cli = new TranslateClient({});
    this.langCodes = [];
    this.sl = 'auto';
    this.tl = 'en';
  }
  private async initialize(cfg: Config): Promise<void> {
    const proxyAgent = getProxyAgent(cfg.proxy);

    this.cli = new TranslateClient({
      requestHandler: new NodeHttpHandler({
        connectionTimeout: cfg.timeout,
        httpAgent: proxyAgent,
        httpsAgent: proxyAgent,
      }),
    });
    const command = new ListLanguagesCommand({});
    const data = await this.cli.send(command);
    if (isUndefined(data.Languages)) {
      logger.error('failed to fetch available languages');
      throw new Error('failed to fetch available languages');
    }
    this.langCodes = compact(map(data.Languages, (v) => v.LanguageCode));

    this.sl = cfg.aws.sourceLanguageCode;
    this.tl = cfg.aws.targetLanguageCode;
    this.formality = {
      formal: Formality.FORMAL,
      informal: Formality.INFORMAL,
      none: undefined,
    }[cfg.aws.formality];

    if (!includes(this.langCodes, this.sl)) {
      logger.error(`not supported language code: ${this.sl}`);
      throw new Error(`not supported language code: ${this.sl}`);
    }
    if (!includes(this.langCodes, this.tl)) {
      logger.error(`not supported language code: ${this.tl}`);
      throw new Error(`not supported language code: ${this.tl}`);
    }
  }

  public async translate(text: string): Promise<string> {
    const params: TranslateTextCommandInput = {
      SourceLanguageCode: this.sl,
      TargetLanguageCode: this.tl,
      Text: text,
      Settings: {
        Formality: this.formality,
      },
    };
    const command = new TranslateTextCommand(params);
    const data = await this.cli.send(command);
    if (isUndefined(data.TranslatedText)) {
      logger.error('translated text is empty');
      throw new Error('translated text is empty');
    }
    return data.TranslatedText;
  }

  public static async create(config: Config): Promise<AwsTranslateManager> {
    const o = new AwsTranslateManager();
    await o.initialize(config);
    return o;
  }
}
