import { window, workspace } from 'coc.nvim';
import { logger } from './logger';

export const getWordStr = async (): Promise<string> => {
  const word = await workspace.nvim.eval('expand("<cword>")');
  if (typeof word !== 'string') {
    logger.error('failed to get the word');
    throw new Error('failed to get the word');
  }
  return word;
};

export const getLineStr = async (): Promise<string> => {
  const line = await workspace.nvim.eval('getline(".")');
  if (typeof line !== 'string') {
    logger.error('failed to get the content of the line');
    throw new Error('failed to get the content of the line');
  }
  return line;
};

export const getVisualSelectedStr = async (): Promise<string> => {
  const range = await window.getSelectedRange('v');
  if (range === null) {
    logger.error('visual range is empty');
    throw new Error('visual range is empty');
  }

  const doc = await workspace.document;
  const lines = doc.getLines(range.start.line, range.end.line + 1);
  if (lines.length === 0) {
    logger.error('no lines are selected');
    throw new Error('no lines are selected');
  }
  lines[lines.length - 1] = lines[lines.length - 1].slice(0, range.end.character);
  lines[0] = lines[0].slice(range.start.character);
  return lines.join('\n');
};
