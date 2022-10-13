import got, { Got } from 'got';
import { includes, isEmpty } from 'lodash-es';
import { Config, getGotInstance, logger } from '../common';
import { googleLangCodes } from './googleLangCodes';

interface Sentence {
  trans: string;
  orig: string;
  backend: number;
}

interface SynsetEntry {
  synonym: string[];
  definition_id: string;
}

interface Synset {
  /**
   * verb, noun, abbreviation
   */
  pos: string;
  entry: SynsetEntry[];
  base_form: string;
}

interface DefinitionEntry {
  gloss: string;
  definition_id: string;
  example?: string;
}
interface Definition {
  pos: string;
  entry: DefinitionEntry[];
  base_form: string;
}

interface Example {
  text: string;
  definition_id: string;
}

interface GoogleTranslateResponse {
  sentences: Sentence[];
  /**
   * detected source language
   */
  src: string;
  /**
   * 0 to 1
   */
  confidence: number;
  /**
   * only for a word (synonyms)
   */
  synsets?: Synset[];
  /**
   * only for a word (definitions)
   */
  definitions?: Definition[];
  /**
   * only for a word (examples)
   */
  examples?: {
    example: Example[];
  };
}

export class GoogleTranslateManager {
  private cli: Got;
  private host: string;
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
    this.cli = got;
    this.host = 'translate.googleapis.com';
    this.langCodes = [];
    this.sl = 'auto';
    this.tl = 'en';
  }
  private async initialize(cfg: Config): Promise<void> {
    this.cli = getGotInstance(cfg);
    this.langCodes = googleLangCodes;

    this.host = cfg.google.host;
    this.sl = cfg.google.sourceLanguageCode;
    this.tl = cfg.google.targetLanguageCode;

    if (!includes(this.langCodes, this.sl)) {
      logger.error(`not supported language code: ${this.sl}`);
      throw new Error(`not supported language code: ${this.sl}`);
    }
    if (!includes(this.langCodes, this.tl)) {
      logger.error(`not supported language code: ${this.tl}`);
      throw new Error(`not supported language code: ${this.tl}`);
    }
  }

  /**
   * translate with google translate
   *
   * reference: <https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params>
   *
   * sl - source language code (auto for autodetection)
   * tl - translation language
   * q - source text / word
   * ie - input encoding (a guess)
   * oe - output encoding (a guess)
   * dj - Json response with names. (dj=1)
   * dt - may be included more than once and specifies what to return in the reply.
   *
   * Here are some values for `dt`. If the value is set, the following data will be returned:
   *   t - translation of source text
   *   at - alternate translations
   *   rm - transcription / transliteration of source and translated texts
   *   bd - dictionary, in case source text is one word (you get translations with articles, reverse translations, etc.)
   *   md - definitions of source text, if it's one word
   *   ss - synonyms of source text, if it's one word
   *   ex - examples
   *   rw - See also list.
   */
  public async translate(text: string): Promise<GoogleTranslateResponse> {
    const url =
      `https://${this.host}/translate_a/single` +
      '?client=gtx' +
      '&dj=1' +
      `&sl=${this.sl}` +
      `&tl=${this.tl}` +
      '&ie=UTF-8' +
      '&oe=UTF-8' +
      '&source=icon' +
      '&dt=t' +
      '&dt=md' +
      '&dt=ex' +
      '&dt=ss' +
      `&q=${encodeURIComponent(text)}`;
    const res = await this.cli.get(url).json<GoogleTranslateResponse>();
    logger.debug(`response: ${JSON.stringify(res, null, 2)}`);

    return res;
  }

  public static async create(config: Config): Promise<GoogleTranslateManager> {
    const o = new GoogleTranslateManager();
    await o.initialize(config);
    return o;
  }
}
