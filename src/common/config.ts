import { Disposable, workspace } from 'coc.nvim';
import { CONFIG_NAME } from './constant';

type AwsFormality = 'formal' | 'informal' | 'none';
type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off';
type Provider = 'aws' | 'google';

export interface Config {
  enable: boolean;
  logLevel: LogLevel;
  timeout: number;
  providers: Provider[];
  proxy: string;
  aws: {
    formality: AwsFormality;
    sourceLanguageCode: string;
    targetLanguageCode: string;
  };
  google: {
    host: string;
    sourceLanguageCode: string;
    targetLanguageCode: string;
  };
}

const defaultConfig: Config = {
  enable: true,
  logLevel: 'debug',
  timeout: 5000,
  providers: ['aws', 'google'],
  proxy: '',
  aws: {
    formality: 'none',
    sourceLanguageCode: 'auto',
    targetLanguageCode: 'en',
  },
  google: {
    host: 'translate.googleapis.com',
    sourceLanguageCode: 'auto',
    targetLanguageCode: 'en',
  },
};

export class ConfigManager implements Disposable {
  cfg: Config;
  private disposables: Disposable[];
  constructor() {
    this.cfg = defaultConfig;
    this.disposables = [];

    // does not work properly
    workspace.onDidChangeConfiguration(
      (ev) => {
        if (ev.affectsConfiguration(CONFIG_NAME)) {
          this.update();
        }
      },
      null,
      this.disposables
    );

    this.update();
  }

  public dispose(): void {
    for (const d of this.disposables) {
      d.dispose();
    }
  }

  private update(): void {
    const configuration = workspace.getConfiguration(CONFIG_NAME);
    this.cfg.enable = configuration.get<boolean>('enable', defaultConfig.enable);
    this.cfg.logLevel = configuration.get<LogLevel>('logLevel', defaultConfig.logLevel);
    this.cfg.timeout = configuration.get<number>('timeout', defaultConfig.timeout);
    this.cfg.providers = configuration.get<Provider[]>('providers', defaultConfig.providers);
    this.cfg.proxy = configuration.get<string>('proxy', defaultConfig.proxy);

    this.cfg.aws.formality = configuration.get<AwsFormality>('aws.formality', defaultConfig.aws.formality);
    this.cfg.aws.sourceLanguageCode = configuration.get<string>(
      'aws.sourceLanguageCode',
      defaultConfig.aws.sourceLanguageCode
    );
    this.cfg.aws.targetLanguageCode = configuration.get<string>(
      'aws.targetLanguageCode',
      defaultConfig.aws.targetLanguageCode
    );

    this.cfg.google.host = configuration.get<string>('google.host', defaultConfig.google.host);
    this.cfg.google.sourceLanguageCode = configuration.get<string>(
      'google.sourceLanguageCode',
      defaultConfig.google.sourceLanguageCode
    );
    this.cfg.google.targetLanguageCode = configuration.get<string>(
      'google.targetLanguageCode',
      defaultConfig.google.targetLanguageCode
    );
  }
}
