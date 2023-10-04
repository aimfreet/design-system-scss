const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerFormat({
    name: 'css/variables',
    formatter: function (dictionary, config) {
        return `${this.selector} {
        ${dictionary.allProperties.map(prop => `--${prop.name}: ${prop.value};`).join('\n')}
      }`;
    },
});

StyleDictionaryPackage.registerTransform({
    name: 'sizes/rem',
    type: 'value',
    matcher: function (prop) {
        // You can be more specific here if you only want 'em' units for font sizes
        return ['fontSize', 'fontSizes'].includes(prop.original.type);
    },
    transformer: function (prop) {
        // You can also modify the value here if you want to convert pixels to ems
        return parseFloat(prop.original.value) / 16 + 'rem';
    },
});

StyleDictionaryPackage.registerTransform({
    name: 'sizes/px',
    type: 'value',
    matcher: function (prop) {
        // You can be more specific here if you only want 'em' units for font sizes
        return ['spacing', 'borderRadius', 'borderWidth', 'lineHeights', 'lineHeight'].includes(
            prop.original.type
        );
    },
    transformer: function (prop) {
        // You can also modify the value here if you want to convert pixels to ems
        return parseFloat(prop.original.value) + 'px';
    },
});

StyleDictionaryPackage.registerTransform({
    name: 'sizes/em',
    type: 'value',
    matcher: function (prop) {
        // You can be more specific here if you only want 'em' units for font sizes
        return ['sizing'].includes(prop.original.type);
    },
    transformer: function (prop) {
        // You can also modify the value here if you want to convert pixels to ems
        return parseFloat(prop.original.value) + 'em';
    },
});

function getStyleDictionaryConfig(theme) {
  return {
      source: [
        `tokens/${theme}.json`,
        `tokens/miro/${theme}.json`
      ],
      platforms: {
          css: {
              transforms: [
                  'attribute/cti',
                  'name/cti/kebab',
                  'sizes/rem',
                  'sizes/px',
                  'sizes/em',
              ],
              buildPath: 'variables/css/',
              files: [
                  {
                      destination: `${theme}.scss`,
                      format: 'css/variables',
                      selector: ':root',
                  },
              ],
          },
          scss: {
              transforms: [
                  'attribute/cti',
                  'name/cti/kebab',
                  'sizes/rem',
                  'sizes/px',
                  'sizes/em',
              ],
              buildPath: 'variables/scss/',
              files: [
                  {
                      destination: `${theme}.scss`,
                      format: 'scss/variables',
                      selector: `.${theme}-theme`,
                  },
              ],
          },
      },
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['global', 'miro-dark', 'miro-light', 'core'].map(function (theme) {
    console.log('\n==============================================');
    console.log(`\nProcessing: [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

    StyleDictionary.buildPlatform('css');
    StyleDictionary.buildPlatform('scss');

    console.log('\nEnd processing');
});

console.log('\n==============================================');
console.log('\nBuild completed!');