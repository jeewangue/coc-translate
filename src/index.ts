import { activateHelper } from 'coc-helper';
import { Documentation, ExtensionContext, FloatFactory, FloatWinConfig, workspace } from 'coc.nvim';
import { includes, isEmpty, map, uniq, filter } from 'lodash-es';
import { Config, ConfigManager, EXT_NAME, getLineStr, getVisualSelectedStr, getWordStr, logger } from './common';
import { AwsTranslateManager, GoogleTranslateManager } from './translate';

class TranslateManager {
  constructor(
    private readonly aws: AwsTranslateManager | null,
    private readonly google: GoogleTranslateManager | null,
    private readonly cfg: Config
  ) {}

  public async translate(rawText: string): Promise<Documentation[]> {
    logger.debug('translate requested');

    const text = rawText.trim();
    if (isEmpty(text)) {
      logger.error('requested text is empty');
      throw new Error('requested text is empty');
    }

    logger.debug(`requested text (trimmed): ${text.slice(0, 20)}`);

    const docs: Documentation[] = [];

    await Promise.all(
      map(uniq(this.cfg.providers), async (provider) => {
        if (provider === 'aws' && this.aws) {
          const content = await this.aws.translate(text);
          docs.push({ filetype: 'markdown', content: `translated by \`AWS\`:\n${content}` });
        }

        if (provider === 'google' && this.google) {
          const res = await this.google.translate(text);
          if (isEmpty(res.sentences)) {
            logger.error('failed to translate');
            throw new Error('failed to translate');
          }
          const content = res.sentences[0].trans;
          docs.push({ filetype: 'markdown', content: `translated by \`Google\`:\n${content}` });
          if (res.definitions) {
            const defs = map(res.definitions, (d) => {
              const def = map(d.entry, (entry, i) => {
                let entryStr = `  ${i + 1}. ${entry.gloss}`;
                if (res.examples) {
                  const examples = map(
                    filter(res.examples.example, (ex) => ex.definition_id === entry.definition_id),
                    (ex) => `     *ex)* ${ex.text.replace(text, `__${text}__`)}`
                  ).join('\n');

                  if (!isEmpty(examples)) {
                    entryStr += '\n' + examples;
                  }
                }
                return entryStr;
              }).join('\n');
              return `  \`[${d.pos}]\`\n${def}\n`;
            }).join('\n');
            docs.push({
              filetype: 'markdown',
              content: `___definitions___\n${defs}`,
            });
          }
          if (res.examples) {
            const examples = map(
              res.examples.example,
              (e, i) => `  ${i + 1}. ${e.text.replace(text, `__${text}__`)}`
            ).join('\n');
            docs.push({ filetype: 'markdown', content: `___examples___\n${examples}` });
          }
        }
      })
    );

    return docs;
  }
}

export async function activate(context: ExtensionContext): Promise<void> {
  await activateHelper(context);

  const cm = new ConfigManager();
  context.subscriptions.push(cm);
  const cfg = cm.cfg;

  if (!cfg.enable || isEmpty(cfg.providers)) {
    return;
  }
  logger.info(`${EXT_NAME} activated!`);
  logger.info(`configurations are applied: ${JSON.stringify(cfg, null, 2)}`);

  const ff = new FloatFactory(workspace.nvim);
  context.subscriptions.push(ff);

  let aws: AwsTranslateManager | null = null;
  let google: GoogleTranslateManager | null = null;
  if (includes(cfg.providers, 'aws')) {
    aws = await AwsTranslateManager.create(cfg);
  }
  if (includes(cfg.providers, 'google')) {
    google = await GoogleTranslateManager.create(cfg);
  }
  const tm = new TranslateManager(aws, google, cfg);

  const floatConfig: FloatWinConfig = {
    border: [1, 1, 1, 1],
  };

  context.subscriptions.push(
    workspace.registerKeymap(
      ['n'],
      'translate-word',
      async () => {
        const text = await getWordStr();

        try {
          const docs = await tm.translate(text);
          return ff.show(docs, floatConfig);
        } catch (e) {
          logger.error(e);
        }
      },
      { sync: false }
    ),
    workspace.registerKeymap(
      ['n'],
      'translate-line',
      async () => {
        const text = await getLineStr();

        try {
          const docs = await tm.translate(text);
          return ff.show(docs, floatConfig);
        } catch (e) {
          logger.error(e);
        }
      },
      { sync: false }
    ),
    workspace.registerKeymap(
      ['v'],
      'translate-selected',
      async () => {
        const text = await getVisualSelectedStr();

        try {
          const docs = await tm.translate(text);
          return ff.show(docs, floatConfig);
        } catch (e) {
          logger.error(e);
        }
      },
      { sync: false }
    )
  );
}
