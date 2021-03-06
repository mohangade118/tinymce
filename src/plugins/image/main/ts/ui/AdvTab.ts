import Settings from '../api/Settings';
import Utils from '../core/Utils';

const updateVSpaceHSpaceBorder = function (editor) {
  return function (evt) {
    const dom = editor.dom;
    const rootControl = evt.control.rootControl;

    if (!Settings.hasAdvTab(editor)) {
      return;
    }

    const data = rootControl.toJSON();
    let css = dom.parseStyle(data.style);

    rootControl.find('#vspace').value('');
    rootControl.find('#hspace').value('');

    css = Utils.mergeMargins(css);

      // Move opposite equal margins to vspace/hspace field
    if ((css['margin-top'] && css['margin-bottom']) || (css['margin-right'] && css['margin-left'])) {
      if (css['margin-top'] === css['margin-bottom']) {
        rootControl.find('#vspace').value(Utils.removePixelSuffix(css['margin-top']));
      } else {
        rootControl.find('#vspace').value('');
      }
      if (css['margin-right'] === css['margin-left']) {
        rootControl.find('#hspace').value(Utils.removePixelSuffix(css['margin-right']));
      } else {
        rootControl.find('#hspace').value('');
      }
    }

      // Move border-width
    if (css['border-width']) {
      rootControl.find('#border').value(Utils.removePixelSuffix(css['border-width']));
    }

    rootControl.find('#style').value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
  };
};

const makeTab = function (editor, updateStyle) {
  return {
    title: 'Advanced',
    type: 'form',
    pack: 'start',
    items: [
      {
        label: 'Style',
        name: 'style',
        type: 'textbox',
        onchange: updateVSpaceHSpaceBorder(editor)
      },
      {
        type: 'form',
        layout: 'grid',
        packV: 'start',
        columns: 2,
        padding: 0,
        alignH: ['left', 'right'],
        defaults: {
          type: 'textbox',
          maxWidth: 50,
          onchange (evt) {
            updateStyle(editor, evt.control.rootControl);
          }
        },
        items: [
          { label: 'Vertical space', name: 'vspace' },
          { label: 'Horizontal space', name: 'hspace' },
          { label: 'Border', name: 'border' }
        ]
      }
    ]
  };
};

export default {
  makeTab
};